import axios from 'axios';
/**
 * @abstract NetworkInterface defines the method that all NetworkInterface classes should implements
 */
export default abstract class NetworkInterface {
  protected provider:string;

  /**
   * @method constructor
   * @param provider the provider for the network connection
   */
  public constructor(provider:string) {
    this.provider = provider;
  }

  /**
   * @method disconnect
   * @brief terminate the connection to the provider
   */
  public abstract disconnect():void;

  /**
   * @method sendTransaction
   * @brief this method sends an unsigned transaction
   * @param transaction required transaction object
   */
  public abstract sendTransaction(transaction:any):Promise<any>

  /**
   *
   * @param callable
   * @param address
   */
  public abstract callMethod(callable:any, address:string):Promise<any>

  static uploadFunction(fileBuffer: string, ename:string, endpoint:string): Promise<any> {
    return axios.post(endpoint,
      {
        zip: fileBuffer,
        name: ename,
      });
  }
}
