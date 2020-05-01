/**
 * @abstract
 */
export default abstract class NetworkInterface {
  /**
   * @function disconnect
   *  terminate the connection to the provider
   */
  public abstract disconnect(): void;

  /**
   *
   * @param contractAddress
   * @param topic
   * @param identifier
   */
  public abstract subscribeEvent(contractAddress: string, topic: string): Promise<any>;

  /**
   * @function sendTransaction
   *  this method sends an signed transaction
   * @param transaction required transaction object
   */
  public abstract sendTransaction(transaction: any): Promise<any>;

  /**
   * @abstract
   * @function callMethod
   * @param callable
   * @param address
   * @returns a Promise that contain the result of the request
   *  this method is used to ask at the contract the execution of non payable methods
   */
  public abstract callMethod(callable: any, address: string): Promise<any>;

  /**
   * @function uploadFunction
   * @param fileBuffer
   * @param ename
   * @param endpoint
   *  this method is used for postRequest with json body.
   */
  public abstract postRequest(endpoint: string, bodyRequest: string): Promise<[number, string]>;
}
