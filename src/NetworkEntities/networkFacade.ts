import Utils from '../utils';

import SessionInterface from './sessionInterface';
import { ContractInterface } from './contractInterface';
import NetworkInterface from './networkInterface';


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


  /**
   * @function constructor this method should not be called outside the network scope
   * @param network
   * @param session
   * @param contract
   */
  constructor(network: NetworkInterface, session: SessionInterface, contract: ContractInterface) {
    this.network = network;
    this.session = session;
    this.contract = contract;
  }

  /**
   * @function logout
   * @brief discards the user credential.
   */
  public logout() {
    this.session.logout();
    this.network.disconnect();
  }

  /**
   * @function signup
   * @param password required for registration
   * @brief provides the functionality or registration to the service
   */
  public signup(password: string): boolean {
    this.session.logout();// because this.logout() use also this.disconnect()
    return this.session.signup(password);
  }

  /**
   * @function logon
   * @param address User address required for logon
   * @param privateKey
   * @param password password required for logon
   * @brief provides the logon service.
   */
  public logon(privateKey: string, password: string): boolean {
    return this.session.logon(privateKey, password);
  }

  /**
   * @function getListOfFunctions
   * @returns an array of strings that represents the history of the user;
   * @brief retrieves the list of the available Contract's methods.
   */
  public getListOfFunctions(): string[] {
    return this.contract.getListOfFunctions();
  }

  /**
   * @function getUserAccount
   * @param password
   * @returns the user's credential
   * @brief returns the user credential
   */
  public getUserAccount(password: string): [string, string] {
    return this.session.getAccount(password);
  }

  /**
   * @function callFunction
   * @param functionName
   * @param parameters
   * @param args
   * @param value
   * @param password
   * @brief executes the function on the ethereum network.
   * DOES NOT EXECUTE USER LOADED FUNCTION
   */
  private async callFunction(functionName: string, args: any[], password?: string, value: number = undefined): Promise<any> {
    const userAddress = this.session.getUserAddress();
    const payable = this.contract.isTheFunctionPayable(functionName);

    try {
      const transaction = await this.contract.getFunctionTransaction({
        userAddress,
        functionName,
        args,
        value,
      });
      if (payable) {
        const signedTransaction = await this.session.signTransaction(transaction, password);
        return this.network.sendTransaction(signedTransaction);
      }
      return this.network.callMethod(transaction, userAddress)
        .then((result) => this.contract.decodeResponse(functionName, result));
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @function uploadFunction
   * @param functionDefinition
   * @param password
   * @brief uploads on the AWS endpoint the required function and register it on the eth network.
   */
  public async createFunction(functionDefinition: FunctionDefinition, password?: string): Promise<any> {
    const endpoint = 'createFunction';
    if (!this.session.isUserSignedIn()) {
      throw new Error('User is not logged in');
    }
    const resourceName = Utils.randomString();
    const bufferFile = Utils.compressFile(functionDefinition.filePath, resourceName);
    const req = { zip: bufferFile, name: resourceName };
    try {
      const uploadResult = await this.network.postRequest(endpoint, JSON.stringify(req));
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
          password);
    } catch (err) {
      throw new Error(`Could not upload the required function ${err}`);
    }
  }

  /**
   * @function getAllLoadedFunction()
   * @returns Promise:any a list of string that contains the all the function loaded by the users
   * @brief retrieves all the functions loaded on the smart contract.
   */
  public async getAllLoadedFunction(): Promise<any> {
    return this.callFunction(NetworkFacade.listCommand, []);
  }

  /**
   * @function getFunctionDetails()
   * @param fnName
   * @param password wallet password
   * @returns a promise that will return the searched function details
   * @brief retrieves from the smart contract the details about the requested function.
   */
  public async getFunctionDetails(fnName: string): Promise<any> {
    return this.callFunction(NetworkFacade.findFunction, [fnName]);
  }

  /**
   * @function getCostOfFunction
   * @param functionName
   * @brief retrieves from the smart contract the cost of a specific function loaded on the service.
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
   * @brief runs a remote function
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
            .then(resolve)
            .catch(reject);
        })
        .catch((err) => { reject(err); });
    });
  }

  /**
   * @function getLog
   * @brief this method is used to retrieve the past commands executed by the user.
   */
  public async getLog(): Promise<string[]> {
    return this.contract.getLog(this.session.getUserAddress());
  }

  /**
   * @function disconnect
   * @brief disconnects the application from the network.
   */
  disconnect() {
    this.network.disconnect();
  }

  getlog(): Promise<string[]> {
    return this.contract.getLog(this.session.getUserAddress());
  }
}

export interface FunctionDefinition {
  fnName: string;
  description: string;
  pro: string;
  filePath: string;
  cost: number;
}
