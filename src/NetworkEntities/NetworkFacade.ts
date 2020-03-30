import { AxiosResponse } from 'axios';
import { rejects } from 'assert';
import { utils } from 'mocha';
import Utils from '../utils';
import SessionInterface from './SessionInterface';
import NetworkInterface from './networkInerface';
import { ContractInterface } from './contractInterface';

const uploadFunctionCommand = process.env.UPLOAD_Function;
/**
 * @class NetworkComponentsFacade
 * @constructor the constructor of this class should't be called.
 */
export default class NetworkComponentsFacade {
    network: NetworkInterface;

    session: SessionInterface;

    contract: ContractInterface;

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
    public signup(password: string):Promise<boolean> {
      return this.session.signup(password);
    }

    /**
     * @method logon
     * @param address User addres required for logon
     * @param password password required for logon
     */
    public logon(address:string, password:string):Promise<boolean> {
      return this.session.logon(address, password);
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
    public async callFunction(functionName:string, parameters:any[], password?:string)
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
        return this.callFunction(uploadFunctionCommand, [functionDefinition.name, functionArn], password);
      } catch (err) {
        throw new Error(`Could not upload the required function ${err}`);
      }
    }
}

export interface functionDefinition{
    name:string,
    bufferFile:string,
    description:string,
    cost: string
    prototype: string
}
