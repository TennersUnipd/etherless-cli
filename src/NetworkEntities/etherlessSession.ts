/**
 * @class SessionEtherlessSmart
 * @implements SessionInterface
 * @constructor the constructor of this class should be not called outside the network package
 */

import Web3 from 'web3';

import { RLPEncodedTransaction, Account, EncryptedKeystoreV3Json } from 'web3-core';

import { isAddress } from 'web3-utils';

import { Wallet } from 'web3-eth-accounts';
import { Transaction } from 'ethereumjs-tx';
import { Buffer } from 'buffer';
import Utils from '../utils';

import SessionInterface from './SessionInterface';


export default class EtherlessSession extends SessionInterface {
  static readonly STORAGE_WALLET_KEY = 'etherless_wallet';

  static readonly chain = 'ropsten';


  private web3:Web3;

  private accountAddress:string;

  /**
   * this costructor shouldn't be called outside the
   * network package
   */
  constructor(provider:any) {
    super();
    this.web3 = provider;
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
    Utils.localStorage.setItem(EtherlessSession.STORAGE_WALLET_KEY, JSON.stringify(encrypted));
  }

  public logout():void {
    this.accountAddress = undefined;
    Utils.localStorage.removeItem(EtherlessSession.STORAGE_WALLET_KEY);
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

  public async signTransaction(transaction: object, password: string): Promise<any> {
    const local = JSON.parse(JSON.stringify(transaction));
    const privateKey = Buffer.from(this.getAccount(password).privateKey.slice(2), 'hex');
    const tx = new Transaction(local, { chain: EtherlessSession.chain });
    tx.sign(privateKey);
    return `0x${tx.serialize()}`;
  }

  // eslint-disable-next-line class-methods-use-this
  public isUserSignedIn(): boolean {
    return Utils.localStorage.getItem(EtherlessSession.STORAGE_WALLET_KEY) !== null;
  }

  public async getBalance(): Promise<number> {
    try {
      const result = await this.web3.eth.getBalance(this.accountAddress);
      return parseInt(result, 10);
    } catch (err) {
      throw new Error(`Could not retrive the balance of the current account: ${err}`);
    }
  }
}
