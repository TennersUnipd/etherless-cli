/**
 * ContractInterface
 *
 * @interface
 * @class ContractInterface
 * @memberof Network
 * This Interface defines all the method that a ContractInterface should implements
 */
export abstract class ContractInterface {
  /**
   * @abstract
   * @function getListOfFunctions
   * @returns string[]
   * retrieves all the available contract's methods
   */
  public abstract getListOfFunctions(): string[];

  /**
   * @abstract
   * @function isTheFunctionPayable
   * @param requested the name of the function requested
   * @returns boolean true if the function is payable
   * returns if the requested function is payable
   */
  public abstract isTheFunctionPayable(requested: string): boolean;


  /**
   * @abstract
   * @function estimateGasCost
   * @param userAddress
   * @param requested the name of the function requested
   * return the estimated gas cost of running a function
   */
  public abstract estimateGasCost(request: FunctionRequest): Promise<number>;

  /**
   * @abstract
   * @function callFunction
   * @param requested the string that identify the function required
   * @param arg an array of required parameters for the execution of the requested function
   * @returns Promise<object> that is a transaction for the requested function.
   * This method returns the transaction about the requested object
   */
  public abstract getFunctionTransaction(request: FunctionRequest): Promise<Transaction>;

  /**
   * @abstract
   * @function getLog
   * @param address address to use as filter for research of past transaction
   * this method retrieve from the network all the history of a specific address
   */
  public abstract getLog(address: string): Promise<string[]>;

  /**
   *
   * @param requested
   * @param encodedResult
   */
  public abstract decodeResponse(requested: string, encodedResult: any): any;

  /**
   * @abstract
   * @function getSignal
   * @param signal the name of the signal thats needs to be captured
   * @param id the identifier of the signal to avoid collision with another request
   * This method capture the signals from the smart contract.
   */
  public abstract getSignal(signalName: string, id: string): Promise<unknown>;

  /**
   *
   * @param functionName
   */
  public abstract getTopic(functionName: string): string;
}

export interface Transaction {
  from: string;
  to: string;
  gas: number;
  data: any;
  value?: any;
}

export interface FunctionRequest {
  userAddress: string;
  functionName: string;
  args?: string[];
  value?: number;
}
