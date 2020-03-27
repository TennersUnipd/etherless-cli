/**
 * ConctractInterface
 * @brief This Interface defines all the method that a ContractInterface should implemets
 * @class ContractInterface
 * @memberof Network
 */
export abstract class ContractInterface {
  protected abi:Object;

  protected contractAddress:string

  protected provider:string

  /**
   *
   * @param ABI
   * @param contractAddress
   */
  public constructor(ABI:any, contractAddress:string, provider:string) {
    this.abi = ABI;
    this.contractAddress = contractAddress;
    this.provider = provider;
  }

  /**
   * getListOfFunctions
   * @brief this method returns all the available methods of the contract
   * @returns string[]
   */
  public abstract getListOfFunctions(): string[];

  /**
   * @method getParametersOfFunction
   * @brief this method returns all the parameter required to run the requested function
   * @param requested the string that identify the function required
   * @returns Inputs[]
   */
  public abstract getArgumentsOfFunction(requested:string):Inputs[];

  /**
   * @method isTheFunctionPayable
   * @brief returns if the requested function is payable
   * @param requested the name of the function requested
   * @returns boolean true if the function is payable
   */
  public abstract isTheFunctionPayable(requested:string):boolean;

  /**
   * @method estimateGasCost
   * @brief return the estmated gas cost of running a function
   * @param userAdress
   * @param requested the name of the function requested
   */
  public abstract estimateGasCost(userAddress:string, requested:string, args:any):Promise<number>;

  /**
   * callFunction
   * @brief This method returns the transaction about the requested object
   * @param requested the string that identify the function required
   * @param arg an array of required parameters for the exection of the requested function
   * @returns Promise<object> that is a transaction for the requested function.
   */
  public abstract getFunctionTransaction(userAddress:string, requested: string, arg: any[])
    :Promise<object>;

  /**
   * getLog
   * @brief this method retrive from the network all the history of a specific address
   * @param address address to use as filter for research of past transaction
   */
  public abstract getLog(address:string):Promise<string[]>;
}

/**
 * @interface Inputs
 * @brief this Iterface defines the structure the arguments request for execution
 */
export interface Inputs {
  internalType: string,
  name: string,
  type: string
}
