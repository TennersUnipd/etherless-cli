import { AxiosResponse } from 'axios';

import { rejects } from 'assert';

import { utils } from 'mocha';

import ListCommand from 'src/CommandEntities/listCommand';
import { Units } from 'web3-utils';
import Utils from '../utils';

import SessionInterface from './SessionInterface';
import { ContractInterface } from './contractInterface';
import NetworkInterface from './networkInerface';


/**
 * @class NetworkComponentsFacade
 * @constructor the constructor of this class should't be called.
 */
export default class NetworkFacade {
    private static uploadFunctionCommand = 'createFunction';

    private static listCommand = 'listFunctions';

    private static remoteExecCommand = 'runFunction';

    private static remoteExecSignal = 'RemoteResponse';

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
     * @method signup
     * @param password required for registation
     * @brief this method proviedes the signup serivice
     */
    public signup(password: string): boolean {
      this.logout();
      return this.session.signup(password);
    }

    /**
     * @method logon
     * @param address User address required for logon
     * @param password password required for logon
     */
    public logon(privateKey:string, password:string): boolean {
      return this.session.logon(privateKey, password);
    }

    /**
     * @method logout()
     */
    public logout() {
      this.session.logout();
      this.disconnect();
    }

    /**
     * @method getListOfFunctions()
     * @returns an array of strings that rapresents the history of the user;
     */
    public getListOfFunctions(): string[] {
      return this.contract.getListOfFunctions();
    }

    /**
     * @method callFunction
     * @param functionName
     * @param parameters
     * @param password
     * @brief this method execute the function on the ethereum network.
     * DOES NOT EXECUTE USER LOADED FUNCTION
     */
    private async callFunction(functionName:string, parameters:any[], password?:string)
        :Promise<any> {
      const payable = this.contract.isTheFunctionPayable(functionName);
      const address = this.session.getUserAddress();
      if (functionName === 'listFunctions') {
        const callable = this.contract.getCallable(functionName, []);
        return this.network.callMethod(callable, address);
      }
      try {
        const gasCost = await this.contract.estimateGasCost(this.session.getUserAddress(),
          functionName, parameters);
        const transaction = await this.contract
          .getFunctionTransaction(address, functionName, parameters);
        console.log(gasCost);
        if (payable) {
          const signedTransaction:string = await this.session.signTransaction(transaction, password);
          return this.network.sendSignedTransaction(signedTransaction);
        }
        return this.network.sendTransaction(transaction);
      } catch (err) {
        throw new Error(`Could not call the function ${functionName}: ${err}`);
      }
    }

    /**
     * @method uploadFunction
     * @param functionDefinition
     * @param password
     * @brief this method upload on the AWS endpoint the required funcion
     * and register it on the eth network.
     */
    public async uploadFunction(functionDefinition:functionDefinition, password?:string): Promise<any> {
      const endpoint = `${process.env.AWS_ENDPOINT}createFunction`;
      if (!this.session.isUserSignedIn()) {
        throw new Error('User is not logged in');
      }
      const awsName = Utils.randomString();
      try {
        // here we should take some eth from the user accout for
        // testing the application and decide the cost of execution
        const uploadResult = await NetworkInterface
          .uploadFunction(functionDefinition.bufferFile, awsName, endpoint);
        const functionArn = uploadResult.data.FunctionArn;
        return this.callFunction(NetworkFacade.uploadFunctionCommand, [functionDefinition.fnName,
          functionDefinition.description, functionDefinition.pro,
          functionArn, functionDefinition.cost], password);
      } catch (err) {
        throw new Error(`Could not upload the required function ${err}`);
      }
    }

    /**
     * @method getAllLoadedFunction()
     * @returns a list of string that contains the all the function loaded on the platform
     */
    public async getAllLoadedFunction() : Promise<any> {
      console.log(NetworkFacade.listCommand);
      return this.callFunction(NetworkFacade.listCommand, []);
    }

    public remoteExecution(fName:string, serializedParams:string, identifier:string, password:string)
    :Promise<any> {
      return this.callFunction(NetworkFacade.remoteExecCommand,
        [fName, serializedParams, identifier],
        password)
        .then((receipt) => this.contract.getSignal(NetworkFacade.remoteExecSignal, identifier))
        .catch((err) => { throw new Error(err); });
    }

    public async getLog() : Promise<string[]> {
      return this.contract.getLog(this.session.getUserAddress());
    }

    /**
     * @method disconnect is used for disconnect the client from the network
     */
    disconnect() {
      this.network.disconnect();
    }
}

export interface functionDefinition{
  fnName:string,
  description:string,
  pro:string,
  bufferFile:string,
  cost:number
}
