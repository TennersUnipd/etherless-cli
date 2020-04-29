/**
 * ContractInterface
 *
 * @brief This Interface defines all the method that a ContractInterface should implements
 * @interface
 * @class ContractInterface
 * @memberof Network
 */
export abstract class ContractInterface {
  /**
   * @abstract
   * @function getListOfFunctions
   * @returns string[]
   * @brief retrieves all the available contract's methods
   */
  public abstract getListOfFunctions(): string[];

  /**
   * @abstract
   * @function isTheFunctionPayable
   * @brief returns if the requested function is payable
   * @param requested the name of the function requested
   * @returns boolean true if the function is payable
   */
  public abstract isTheFunctionPayable(requested: string): boolean;


  /**
   * @abstract
   * @function estimateGasCost
   * @brief return the estimated gas cost of running a function
   * @param userAddress
   * @param requested the name of the function requested
   */
  public abstract estimateGasCost(request: FunctionRequest): Promise<number>;

  /**
   * @abstract
   * @function callFunction
   * @param requested the string that identify the function required
   * @param arg an array of required parameters for the execution of the requested function
   * @returns Promise<object> that is a transaction for the requested function.
   * @brief This method returns the transaction about the requested object
   */
  public abstract getFunctionTransaction(request: FunctionRequest): Promise<Transaction>;

  /**
   * @abstract
   * @function getLog
   * @param address address to use as filter for research of past transaction
   * @brief this method retrieve from the network all the history of a specific address
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
   * @brief This method capture the signals from the smart contract.
   */
  public abstract getSignal(signalName: string, id: string): Promise<unknown>;

  /**
   *
   * @param functionName
   */
  public abstract getTopic(functionName: string): string;
}

/**
 * @structure Transaction
 * @brief this structure defines the arguments request for execution
 */
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
