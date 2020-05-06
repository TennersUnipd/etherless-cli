/**
 * @class SessionEtherlessSmart
 * @implements SessionInterface
 * @class the constructor of this class should be not called outside the network package
 */

import Web3 from 'web3';

import {
  RLPEncodedTransaction, Account, EncryptedKeystoreV3Json, SignedTransaction,
} from 'web3-core';
import Utils from '../utils';

import SessionInterface from './sessionInterface';


export default class EtherlessSession extends SessionInterface {
  static readonly STORAGE_WALLET_KEY = 'etherless_wallet';

  static readonly chain = 'ropsten';


  private web3: Web3;

  private accountAddress: string;

  /**
   * this constructor shouldn't be called outside the
   * network package
   *
   * @param provider
   */
  constructor(provider: any) {
    super();
    this.web3 = provider;
    if (this.isUserSignedIn()) {
      this.accountAddress = this.getUserAddress();
    }
  }

  public signup(password: string): boolean {
    const newAccount = this.web3.eth.accounts.create();
    this.storeAccount(newAccount, password);
    return true;
  }

  public logon(privateKey: string, password: string): boolean {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.storeAccount(account, password);
    return true;
  }

  private storeAccount(account: Account, password: string): void {
    this.web3.eth.accounts.wallet.add(account);
    const encrypted = this.web3.eth.accounts.wallet.encrypt(password);
    Utils.localStorage.setItem(EtherlessSession.STORAGE_WALLET_KEY, JSON.stringify(encrypted));
  }

  public logout(): void {
    this.accountAddress = undefined;
    Utils.localStorage.removeItem(EtherlessSession.STORAGE_WALLET_KEY);
  }


  public getAccount(password: string): [string, string] {
    const encryptedWallet = EtherlessSession.getWallet();
    const wallet = this.web3.eth.accounts.wallet.decrypt(encryptedWallet, password);
    const calc = this.web3.eth.accounts.privateKeyToAccount(wallet[0].privateKey).address;
    if (calc !== wallet[0].address) throw new Error('Invalid password');
    return [wallet[0].address, wallet[0].privateKey];
  }

  private static getWallet(): EncryptedKeystoreV3Json[] {
    const encryptedWallet = Utils.localStorage.getItem(EtherlessSession.STORAGE_WALLET_KEY);
    try {
      return JSON.parse(encryptedWallet) as EncryptedKeystoreV3Json[];
    } catch {
      throw new Error('Unable to read internal file');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public getUserAddress(): string { //
    const encryptedWallet = EtherlessSession.getWallet();
    if (encryptedWallet != null && encryptedWallet.length > 0) return `0x${encryptedWallet[0].address}`;

    throw new Error('Wallet is empty');
  }

  public async signTransaction(transaction: object, password: string): Promise<SignedTransaction> {
    const loggedUser = this.getAccount(password);
    return new Promise<any>((resolve, reject) => {
      const signPromise = this.web3.eth.accounts.signTransaction(transaction, loggedUser[1]);
      signPromise.then((signedTx) => {
        resolve(signedTx);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public isUserSignedIn(): boolean {
    return Utils.localStorage.getItem(EtherlessSession.STORAGE_WALLET_KEY) !== null;
  }

  public async getBalance(): Promise<number> {
    try {
      const result = await this.web3.eth.getBalance(this.getUserAddress());
      return parseInt(result, 10);
    } catch (err) {
      throw new Error(`Could not retrieve the balance of the current account: ${err.message}`);
    }
  }
}
