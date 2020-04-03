/**
 * @author Tenners
 * SessionInterface is the contract that defines which function every session object should have
 * @Class SessionInterface
 *
 */
export default abstract class SessionInterface {
  /**
     * @brief This method provides the signup functionality
     * @returns boolean
     * @param password is need for encrypt the privateKey
     */
  public abstract signup(password:string): boolean;

  /**
     * @brief This method should provide the logon functionality for external credential
     * @param address is required for the user identification
     * @param privateKey is required for verify the user identity
     * @param password needed for saving the credential and unlocking the account
     *
     */
  public abstract logon(privateKey:string, password:string):boolean;

  /**
     * @brief This method offers the logout functionality deleting the
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
   * @method getBalance()
   * @returns the balance
   */
  public abstract getBalance():Promise<number>;
}
