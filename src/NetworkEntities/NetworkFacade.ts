import { AxiosResponse } from 'axios';

import { rejects } from 'assert';

import { utils } from 'mocha';

import Utils from '../utils';

import SessionInterface from './SessionInterface';
import { ContractInterface } from './contractInterface';
import NetworkInterface from './networkInerface';


/**
 * @class NetworkComponentsFacade
 * @constructor the constructor of this class should't be called.
 */
export default class NetworkFacade {
    private static uploadFunctionCommand = process.env.UPLOAD_Function;

    private static listCommand = process.env.LIST_Function;

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
      const transaction = this.contract.getFunctionTransaction(address, functionName, parameters);
      try {
        if (payable) {
          const signedTransaction:string = await this.session.signTransaction(transaction, password);
          return this.network.sendSignedTransaction(signedTransaction);
        }
        return this.network.sendTransaction(transaction);
      } catch (err) {
        throw new Error(`Could not call the function: ${err}`);
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
      if (this.session.isUserSignedIn()) {
        throw new Error('User is not logged in');
      }
      const awsName = Utils.randomString();
      try {
        // here we should take some eth from the user accout for
        // testing the application and decide the cost of execution
        const uploadResult = await NetworkInterface
          .uploadFunction(functionDefinition.bufferFile, awsName, endpoint);
        const functionArn = uploadResult.data.FunctionArn;
        return this.callFunction(NetworkFacade.uploadFunctionCommand, [functionDefinition.name, functionArn], password);
      } catch (err) {
        throw new Error(`Could not upload the required function ${err}`);
      }
    }

    public async getAllLoadedFunction() : Promise<any> {
      return this.callFunction(NetworkFacade.listCommand, []);
    }

    public remoteExecution(fName:string, serializedParams:string, identifier:string, password:string): any {
      this.callFunction('runCommand', [fName, serializedParams, identifier], password)
        .then((result) => {
          // attendo la risposta;
        })
        .catch((err) => { throw new Error(err); });
    }

    public async getLog() : Promise<string[]> {
      return this.contract.getLog(this.session.getUserAddress());
    }

    /**
     *
     */
    disconnect() {
      this.network.disconnect();
    }
}

export interface functionDefinition{
    name:string,
    bufferFile:string,
    description:string,
    cost: string
    prototype: string
}
