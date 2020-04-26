/**
 * ContractInterface
 * @brief This Interface defines all the method that a ContractInterface should implements
 * @interface
 * @class ContractInterface
 * @memberof Network
 */
export abstract class ContractInterface {

  /**
   * @abstract
   * @method getListOfFunctions
   * @returns string[]
   * @brief retrieves all the available contract's methods
   */
  public abstract getListOfFunctions(): string[];

  /**
   * @abstract
   * @method getParametersOfFunction
   * @param requested the string that identify the function required
   * @returns Inputs[]
   * @brief returns all the parameter required to run the requested function
   */
  public abstract getArgumentsOfFunction(requested: string): Inputs[];

  /**
   * @abstract
   * @method isTheFunctionPayable
   * @brief returns if the requested function is payable
   * @param requested the name of the function requested
   * @returns boolean true if the function is payable
   */
  public abstract isTheFunctionPayable(requested: string): boolean;

  /**
   * @abstract
   * @method estimateGasCost
   * @brief return the estimated gas cost of running a function
   * @param userAddress
   * @param requested the name of the function requested
   */
  public abstract estimateGasCost(userAddress: string, requested: string, args: any[], value: number): Promise<number>;

  /**
   * @abstract
   * @method callFunction
   * @param requested the string that identify the function required
   * @param arg an array of required parameters for the execution of the requested function
   * @returns Promise<object> that is a transaction for the requested function.
   * @brief This method returns the transaction about the requested object
   */
  public abstract getFunctionTransaction(userAddress: string, requested: string, arg: any[], gasEstimate: number, value: number)
    : Promise<object>;


  /**
   * @abstract
   * @method getCallable
   * @param requested
   * @param any
   */
  public abstract getCallable(requested: string, arg: any[]): any

  /**
   * @abstract
   * @method getLog
   * @param address address to use as filter for research of past transaction
   * @brief this method retrieve from the network all the history of a specific address
   */
  public abstract getLog(address: string): Promise<string[]>;

  /**
   * @abstract
   * @method getSignal
   * @param signal the name of the signal thats needs to be captured
   * @param id the identifier of the signal to avoid collision with another request
   * @brief This method capture the signals from the smart contract.
   */
  public abstract getSignal(signalName: string, id: string): Promise<any>;
}

/**
 * @structure Inputs
 * @brief this structure defines the arguments request for execution
 */
export interface Inputs {
  internalType: string,
  name: string,
  type: string
}
