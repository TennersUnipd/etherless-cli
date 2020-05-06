import Utils from '../utils';

import { ContractInterface } from './contractInterface';
import NetworkInterface from './networkInterface';
import SessionInterface from './sessionInterface';


/**
 * @class NetworkComponentsFacade
 * @class the constructor of this class shouldn't be called.
 */
export class NetworkFacade {
  // group commands under common structure (like an enum mapping to strings)
  private static createFunctionCommand = 'createFunction';

  private static listCommand = 'listFunctions';

  private static remoteExecCommand = 'runFunction';

  private static remoteExecSignal = 'RemoteResponse';

  private static costOfFunction = 'costOfFunction';

  private static findFunction = 'findFunction';

  private network: NetworkInterface;

  private session: SessionInterface;

  private contract: ContractInterface;

  private static setExecCommand = 'setFunctionProperty';

  private static deleteFunction = 'deleteFunction';

  private static getArn = 'getArn';

  /**
   * @function constructor this method should not be called outside the network scope
   * @param {NetworkInterface} network instance of NetworkInterface
   * @param {SessionInterface} session instance of SessionInterface
   * @param {ContractInterface} contract instance of ContractInterface
   */
  constructor(network: NetworkInterface, session: SessionInterface, contract: ContractInterface) {
    this.network = network;
    this.session = session;
    this.contract = contract;
  }

  /**
   * @function logout
   * discards the user credential.
   */
  public logout(): void {
    this.session.logout();
    this.network.disconnect();
  }

  /**
   * @function signup
   * @param {string} password required for registration
   * @returns {boolean}
   * provides the functionality or registration to the service
   */
  public signup(password: string): boolean {
    this.session.logout();// because this.logout() use also this.disconnect()
    return this.session.signup(password);
  }

  /**
   * @function logon
   * @param {string} privateKey private key for ethereum
   * @param {string} password password required for logon
   * @returns {boolean}
   * provides the logon service.
   */
  public logon(privateKey: string, password: string): boolean {
    return this.session.logon(privateKey, password);
  }

  /**
   * @function getListOfFunctions
   * @returns {string[]} an array of strings that represents the history of the user;
   * retrieves the list of the available Contract's methods.
   */
  public getListOfFunctions(): string[] {
    return this.contract.getListOfFunctions();
  }

  /**
   * @function getUserAccount
   * @param {string} password needed for encryption
   * @returns {[string, string]} the user's credential
   */
  public getUserAccount(password: string): [string, string] {
    return this.session.getAccount(password);
  }

  /**
   * @function callFunction
   * @param {string} functionName the name of the contract's method to call
   * @param {string[]} args parameters needed for execution
   * @param {string} password password needed for signing the transaction
   * @param {number} value defines how much eth transfer
   * executes the function on the ethereum network.
   * DOES NOT EXECUTE USER LOADED FUNCTION
   */
  private async callFunction(functionName: string, args: string[],
    password?: string, value = 0): Promise<any> {
    if (!this.session.isUserSignedIn()) throw new Error('User not logged');
    const userAddress = this.session.getUserAddress();
    const payable = this.contract.isTheFunctionPayable(functionName);
    const transaction = await this.contract.getFunctionTransaction({
      userAddress,
      functionName,
      args,
      value,
    }).catch(() => { throw new Error('Resource not available'); });
    if (payable) {
      const signedTransaction = await this.session.signTransaction(transaction, password);
      return this.network.sendTransaction(signedTransaction);
    }
    return this.network.callMethod(transaction, userAddress)
      .then((result) => this.contract.decodeResponse(functionName, result));
  }

  /**
   * @function uploadFunction
   * @param functionDefinition
   * @param password
   *  uploads on the AWS endpoint the required function and register it on the eth network.
   */
  public async createFunction(functionDefinition: FunctionDefinition,
    password?: string): Promise<any> {
    if (!this.session.isUserSignedIn()) throw new Error('User is not logged in');
    const resourceName = Utils.randomString();
    const bufferFile = Utils.compressFile(functionDefinition.filePath, resourceName);
    const req = { zip: bufferFile, name: resourceName };
    try {
      const uploadResult = await this.network.postRequest(NetworkFacade.createFunctionCommand, JSON.stringify(req));
      const functionArn = JSON.parse(uploadResult[1]).FunctionArn;
      return this
        .callFunction(NetworkFacade.createFunctionCommand,
          [
            functionDefinition.fnName,
            functionDefinition.description,
            functionDefinition.pro,
            functionArn,
            functionDefinition.cost,
          ],
          password).catch(() => { throw new Error('Name already used or parameters not valid'); });
    } catch (err) {
      throw new Error(`Could not upload the required function ${err.message}`);
    }
  }

  /**
   * @function getAllLoadedFunction()
   * @returns Promise:any a list of string that contains the all the function loaded by the users
   *  retrieves all the functions loaded on the smart contract.
   */
  public async getAllLoadedFunction(): Promise<any> {
    return this.callFunction(NetworkFacade.listCommand, []);
  }

  /**
   * @function getFunctionDetails()
   * @param fnName
   * @param password wallet password
   * @returns a promise that will return the searched function details
   *  retrieves from the smart contract the details about the requested function.
   */
  public async getFunctionDetails(fnName: string): Promise<any> {
    return this.callFunction(NetworkFacade.findFunction, [fnName]);
  }

  /**
   * @function getCostOfFunction
   * @param functionName
   *  retrieves from the smart contract the cost of a specific function loaded on the service.
   */
  public async getCostOfFunction(functionName: string): Promise<number> {
    return this.callFunction(NetworkFacade.costOfFunction, [functionName]);
  }

  /**
   * @function runFunction
   * @param fName
   * @param serializedParams
   * @param password
   * @returns the result of the remote execution
   *  runs a remote function
   */
  public async runFunction(fName: string, serializedParams: string,
    password: string): Promise<any> {
    const identifier = Utils.randomString();
    const cost = await this.getCostOfFunction(fName);
    return new Promise((resolve, reject) => {
      this.callFunction(NetworkFacade.remoteExecCommand,
        [fName, serializedParams, identifier],
        password,
        cost)
        .then(() => {
          console.log('Request sent');
          this.contract.getSignal(NetworkFacade.remoteExecSignal, identifier)
            .then((elemen) => {
              resolve(JSON.stringify({
                fName, serializedParams, cost, elemen,
              }));
            })
            .catch(reject);
        })
        .catch((err) => { reject(err); });
    });
  }

  /**
   * @function setFunctionProperty
   * @param fnName Function name
   * @param property Property to update
   * @param newValue New value for property
   * @param password Wallet password
   *  Updates function properties like cost, description and prototype.
   */
  public async setFunctionProperty(fnName: string, property: string,
    newValue: string, password?: string): Promise<any> {
    // check available properties
    if (!['prototype', 'cost', 'description'].includes(property)) {
      throw new Error('Invalid property. Only cost, description and prototype can be updated');
    }
    return this.callFunction(NetworkFacade.setExecCommand, [fnName, property, newValue], password);
  }

  /**
   * @function deleteFunction
   * @param fnName Function name
   * @param password Wallet password
   *  Deletes a function
   */
  public async deleteFunction(fnName: string, password?: string): Promise<any> {
    const endpoint = 'deleteFunction';
    const arn = await this.callFunction(NetworkFacade.getArn, [fnName])
      .catch((error) => { throw error; });
    await this.network.postRequest(endpoint, JSON.stringify({ ARN: arn }))
      .catch((err) => { throw err; });
    return this.callFunction(NetworkFacade.deleteFunction, [fnName], password)
      .catch(() => { throw new Error('Error on contract delete'); });
  }


  /**
   * @function updateFunction
   * @param fnName
   * @param filePath
   * @param fName
   *  Update the user's function
   */
  public async updateFunction(fnName: string, filePath: string): Promise<any> {
    const endpoint = 'updateFunction';
    const arn = await this.callFunction(NetworkFacade.getArn, [fnName]);
    const index = arn.lastIndexOf(':');
    const resourceName = arn.substr(index + 1);
    const bufferFile = Utils.compressFile(filePath, resourceName);
    return this.network.postRequest(endpoint, JSON.stringify({ zip: bufferFile, ARN: arn }));
  }

  /**
   * @function disconnect
   *  disconnects the application from the network.
   */
  disconnect(): void {
    this.network.disconnect();
  }
}

export interface FunctionDefinition {
  fnName: string;
  description: string;
  pro: string;
  filePath: string;
  cost: number;
}
