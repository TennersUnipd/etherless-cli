/**
 * @class SessionEtherlessSmart
 * @implements SessionInterface
 * @constructor the constructor of this class should be not called outside the network package
 */

import { Personal } from 'web3-eth-personal';

import Web3 from 'web3';

import { RLPEncodedTransaction, Account, EncryptedKeystoreV3Json } from 'web3-core';

import { isAddress } from 'web3-utils';

import { Wallet } from 'web3-eth-accounts';
import Utils from '../utils';

import SessionInterface from './SessionInterface';
import NetworkUtils from './NetworkUtils';


export default class EtherlessSession extends SessionInterface {
  private personal:Personal;

  private web3:Web3;

  private accountAddress:string;

  /**
   * this costructor shouldn't be called outside the
   * network package
   */
  constructor(provider:string | any) {
    super(provider);
    this.web3 = provider;
    this.personal = provider.eth.personal;
    if (this.isUserSignedIn()) {
      this.accountAddress = this.getUserAddress();
    }
  }

  public signup(password:string): boolean {
    const newAccount = this.web3.eth.accounts.create();
    this.storeAccount(newAccount, password);
    return true;
  }

  public logon(privateKey:string, password:string): boolean {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.storeAccount(account, password);
    return true;
  }

  private storeAccount(account: Account, password: string) {
    this.web3.eth.accounts.wallet.add(account);
    const encrypted = this.web3.eth.accounts.wallet.encrypt(password);
    Utils.localStorage.setItem(SessionInterface.STORAGE_WALLET_KEY, JSON.stringify(encrypted));
  }

  public logout():void {
    this.accountAddress = undefined;
    Utils.localStorage.removeItem(SessionInterface.STORAGE_WALLET_KEY);
  }

  private getAccount(password: string): Account {
    const encryptedWallet = EtherlessSession.getWallet();
    try {
      const wallet = this.web3.eth.accounts.wallet.decrypt(encryptedWallet, password);
      return wallet[0];
    } catch {
      throw new Error('Unable to read internal storage');
    }
  }

  private static getWallet(): EncryptedKeystoreV3Json[] {
    const encryptedWallet = Utils.localStorage.getItem(SessionInterface.STORAGE_WALLET_KEY);
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

  public async signTransaction(transaction: object, password: string): Promise<any> {
    if (password === undefined || password === '') {
      throw new Error('Missing password');
    }
    const signedtransaction:any = await this
      .personal.signTransaction(transaction, password, (reason) => {
        if (reason !== null) {
          throw new Error(`Couldn't sign the transaction beacause ${reason}`);
        }
      });
    return signedtransaction.rawTransaction;
  }

  // eslint-disable-next-line class-methods-use-this
  public isUserSignedIn(): boolean {
    // const verify:string = this.getUserAddress();
    // if (verify === undefined || verify === '') { return false; }
    // Web3.utils.isAddress(Web3.utils.toChecksumAddress(verify));
    return Utils.localStorage.getItem(SessionInterface.STORAGE_WALLET_KEY) !== null;
  }
}
