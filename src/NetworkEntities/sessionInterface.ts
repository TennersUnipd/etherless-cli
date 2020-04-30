/**
 * @author Tenners
 * SessionInterface is the contract that defines which function every session object should have
 * @Class SessionInterface
 *
 */
export default abstract class SessionInterface {
  /**
   *  provides the signup functionality
   *
   * @returns boolean
   * @param password is need for encrypt the privateKey
   */
  public abstract signup(password: string): boolean;

  /**
   *  provides the logon functionality for external credential
   *
   * @param address is required for the user identification
   * @param privateKey is required for verify the user identity
   * @param password needed for saving the credential and unlocking the account
   *
   */
  public abstract logon(privateKey: string, password: string): boolean;

  /**
   *  This method offers the logout functionality deleting the
   * local information about the user
   */
  public abstract logout(): void;

  /**
   *  This method offers the functionality of sing the transaction for validation
   *
   * @param transaction
   * @param password
   */
  public abstract signTransaction(transaction: object, password: string): Promise<any>;

  /**
   * @function isUserSignedIn
   *  checks that the user is logged.
   * @returns true if the user has his credential saved.
   */
  public abstract isUserSignedIn(): boolean;

  /**
   * @function getUserAddress
   *  retrieves the user address
   * @returns string that represents the user public address.
   */
  public abstract getUserAddress(): string;

  /**
   * @function getBalance()
   * @returns a promise that contains the number that represents the balance of the current account
   *  retrieves the balance from the account
   */
  public abstract getBalance(): Promise<number>;

  /**
   * @abstract
   * @function getAccount
   * @param password needed for local unlock
   *  returns the account information
   */
  public abstract getAccount(password: string): [string, string];
}
