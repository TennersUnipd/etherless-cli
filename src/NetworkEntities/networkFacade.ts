import { AxiosResponse } from 'axios';

import { rejects } from 'assert';

import { utils } from 'mocha';

import Utils from '../utils';

import SessionInterface from './sessionInterface';
import { ContractInterface } from './contractInterface';
import NetworkInterface from './networkInterface';


/**
 * @class NetworkComponentsFacade
 * @constructor the constructor of this class shouldn't be called.
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
     * @method constructor this method should not be called outside the network scope
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
     * @method logout
     * @brief discards the user credential.
     */
    public logout() {
      this.session.logout();
      this.network.disconnect();
    }

    /**
     * @method signup
     * @param password required for registration
     * @brief provides the functionality or registration to the service
     */
    public signup(password: string): boolean {
      this.session.logout();// because this.logout() use also this.disconnect()
      return this.session.signup(password);
    }

    /**
     * @method logon
     * @param address User address required for logon
     * @param password password required for logon
     * @brief provides the logon service.
     */
    public logon(privateKey:string, password:string): boolean {
      return this.session.logon(privateKey, password);
    }

    /**
     * @method getListOfFunctions
     * @returns an array of strings that represents the history of the user;
     * @brief retrieves the list of the available Contract's methods.
     */
    public getListOfFunctions(): string[] {
      return this.contract.getListOfFunctions();
    }

    /**
     * @method getUserAccount
     * @param password 
     * @returns the user's credential
     * @brief returns the user credential
     */
    public getUserAccount(password: string): [string,string] {
      return this.session.getAccount(password);
    }

    /**
     * @method callFunction
     * @param functionName
     * @param parameters
     * @param password
     * @brief executes the function on the ethereum network.
     * DOES NOT EXECUTE USER LOADED FUNCTION
     */
    private async callFunction(functionName:string, parameters:any[], password?:string, isCallable: boolean = true, value: number = undefined)
        :Promise<any> {
      const address = this.session.getUserAddress();
      const payable = this.contract.isTheFunctionPayable(functionName);
      if (payable || !isCallable) {
        // get cost of function
        const gasCost = await this.contract.estimateGasCost(
          address,
          functionName,
          parameters,
          value,
        );
        const transaction = await this.contract
          .getFunctionTransaction(address, functionName, parameters, gasCost, value);
        const signedTransaction = await this.session.signTransaction(transaction, password);
        return this.network.sendTransaction(signedTransaction);
      }
      // not payable
      const callable = this.contract.getCallable(functionName, parameters);
      return this.network.callMethod(callable, address);
    }

    /**
     * @method uploadFunction
     * @param functionDefinition
     * @param password
     * @brief uploads on the AWS endpoint the required function and register it on the eth network.
     */
    public async createFunction(functionDefinition:FunctionDefinition, password?:string): Promise<any> {
      const endpoint = `${process.env.AWS_ENDPOINT}createFunction`;
      if (!this.session.isUserSignedIn()) {
        throw new Error('User is not logged in');
      }
      const resourceName = Utils.randomString();
      const bufferFile = Utils.compressFile(functionDefinition.filePath, resourceName);
      try {
        // here we should take some eth from the user account for
        // testing the application and decide the cost of execution
        const uploadResult = await NetworkInterface
          .uploadFunction(bufferFile, resourceName, endpoint);
        const functionArn = uploadResult.data.FunctionArn;
        return this.callFunction(NetworkFacade.createFunctionCommand, [functionDefinition.fnName,
          functionDefinition.description, functionDefinition.pro,
          functionArn, functionDefinition.cost], password, false);
      } catch (err) {
        throw new Error(`Could not upload the required function ${err}`);
      }
    }

    /**
     * @method getAllLoadedFunction()
     * @returns a list of string that contains the all the function loaded on the platform
     * @brief retrieves all the functions loaded on the smart contract.
     */
    public async getAllLoadedFunction() : Promise<any> {
      return this.callFunction(NetworkFacade.listCommand, []);
    }

    /**
     * @method getFunctionDetails()
     * @param password wallet password
     * @returns a promise that will return the searched function details
     * @brief retrieves from the smart contract the details about the requested function.
     */
    public async getFunctionDetails(fnName: string) : Promise<any> {
      return this.callFunction(NetworkFacade.findFunction, [fnName]);
    }
    /**
     * @method getCostOfFunction
     * @param functionName 
     * @brief retrieves from the smart contract the cost of a specific function loaded on the service.
     */
    public async getCostOfFunction(functionName: string) : Promise<number> {
      return this.callFunction(NetworkFacade.costOfFunction, [functionName]);
    }

    /**
     * @method runFunction
     * @param fName 
     * @param serializedParams 
     * @param password 
     * @returns the result of the remote execution
     * @brief runs a remote function 
     */
    public async runFunction(fName:string, serializedParams:string, password:string)
    :Promise<any> {
      const identifier = Utils.randomString();
      const cost = await this.getCostOfFunction(fName);
      const resultProm = new Promise<string>((resolve, reject) => {
        this.callFunction(NetworkFacade.remoteExecCommand,
          [fName, serializedParams, identifier],
          password, false, cost)
          .then(() => {
            console.log('Request sent');
            this.contract.getSignal(NetworkFacade.remoteExecSignal, identifier)
              .then(resolve)
              .catch(reject);
          })
          .catch(resolve);
      });
      return resultProm;
    }

    /**
     * @method getLog
     * @brief this method is used to retrieve the past commands executed by the user.
     */
    public async getLog() : Promise<string[]> {
      return this.network.getLog(this.session.getUserAddress());
    }

    /**
     * @method disconnect
     * @brief disconnects the application from the network.
     */
    disconnect() {
      this.network.disconnect();
    }

    /**
     * @method getListOfTransaction()
     * @returns a promise that will return the transactions exec from that account
     * @brief retrieves transactions from the account logged to the smart of etherless.
     */
    public async getListOfTransaction() : Promise<any> {
      let accountAddress = this.session.getUserAddress();
      let logToDecode = await this.network.getLog(accountAddress);
      let attheend = await this.contract.getDecodeLog(logToDecode[0]);
      return attheend;
    }
}

export interface FunctionDefinition{
  fnName:string,
  description:string,
  pro:string,
  filePath:string,
  cost:number
}
