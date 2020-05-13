/**
 * ContractInterface
 *
 * @interface
 * @file contractInterface.ts
 * @class ContractInterface
 * @package NetworkEntities
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
   * @function decodeResponse
   * @param requested
   * @param encodedResult
   * @return the decoded response
   * get in input the function with the relative output and decode the ABI response
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
   * @function getTopic
   * @param functionName
   * @return the topic about the function requested
   */
  public abstract getTopic(functionName: string): string;
}

/**
 * @struct
 * defines the data structure of a transaction
 */
export interface Transaction {
  nonce: number;
  from: string;
  to: string;
  gas: number;
  data: any;
  value?: any;
}

/**
 * @struct
 * defines the data structure for a request of execution of a contract function.
 */
export interface FunctionRequest {
  userAddress: string;
  functionName: string;
  args?: string[];
  value?: number;
}
