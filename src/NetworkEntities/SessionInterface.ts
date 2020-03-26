/**
 * @author Tenners
 * SessionInterface is the contract that defines which function every session object should have
 * @Class SessionInterface
 *
 */
export default abstract class SessionInterface {
    protected provider:string

    /**
   *
   */
    constructor(provider:string) {
      this.provider = provider;
    }

  /**
     * @brief This method provides the signup functionality
     * @returns boolean
     * @param password is need for encrypt the privateKey
     */
  public abstract async signup(password:string): Promise<boolean>;

  /**
     * @brief This method should provide the logon functionality for exsterna credential
     * @param address is required for the user identification
     * @param privateKey is required for sign the transaction
     * @param password needed for saving the credential and unlocking the account
     *
     */
  public abstract logon(privateKey:string, password:string):boolean;

  /**
     * @brief This method offers the logout funcitionality deleting the
     * local information about the user
     */
  public abstract logout(): void;

  /**
     * @brief This method offers the functionality of sing the transaction for validation
     * @param transaction
     * @param password
     */
  public abstract signTransaction(transaction:object, password:string): Promise<any>;

  /**
     * isUserSignedIn
     * This method return true if the user has his credential saved.
     */
  public abstract isUserSignedIn():boolean;

  /**
     * getUserAddress
     */
  public abstract getUserAddress():string;

  /**
     * sendTransaction need to be moved to to the NetworkInterface

    sendTransaction(signedTransaction):Promise<any> */
}
