/**
 * @class SessionEtherlessSmart
 * @implements SessionInterface
 * @constructor the constructor of this class should be not called outside the network package
 */

import { Personal } from 'web3-eth-personal';
import Web3 from 'web3';
import { RLPEncodedTransaction } from 'web3-core';
import { isAddress } from 'web3-utils';
import Utils from '../utils';
import SessionInterface from './SessionInterface';


export default class EtherlessSession extends SessionInterface {
  private personal:Personal;

  private accountAddress:string;

  private readonly STORAGE_KEY = 'localAddress';

  /**
   * this costructor should't be called outside the
   * network package
   */
  constructor(provider:string) {
    super(provider);
    this.personal = new Web3(provider).eth.personal;
    if (this.isUserSignedIn) {
      this.accountAddress = this.getUserAddress();
    }
  }

  public async signup(password:string):Promise<boolean> {
    const result:string | void = await this.personal.newAccount(password, (reason) => {
      if (reason !== null) {
        throw new Error(`Could not coplete the registratin process because ${reason}`);
      }
    });
    let address = '';
    if (typeof result !== 'undefined') {
      address = result;
    }
    return this.saveAddress(address);
  }

  public logon(privateKey:string, password:string):boolean {
    let result = true;
    this.personal.importRawKey(privateKey, password, (reason) => {
      if (reason !== null) {
        result = false;
        throw new Error(`Couldn't import the private key provided ${reason}`);
      }
    }).then(this.saveAddress);
    return result;
  }

  public logout():void {
    this.accountAddress = undefined;
    Utils.localStorage.removeItem(this.accountAddress);
  }

  public getUserAddress():string {
    if (!this.isUserSignedIn) { throw new Error('The user is not logged in'); }
    return this.accountAddress;
  }

  public async signTransaction(transaction: object, password: string): Promise<any> {
    if (password === undefined || password === '') {
      throw new Error('Missing password');
    }
    const signedtransaction:any = await this
      .personal.signTransaction(transaction, password, (reason) => {
        if (reason !== null) {
          throw new Error(`Couldn't sign the tranasaction beacause ${reason}`);
        }
      });
    return signedtransaction;
  }

  public isUserSignedIn(): boolean {
    const verify:string = Utils.localStorage.getItem(this.STORAGE_KEY);
    if (verify === undefined || verify === '') { return false; }
    Web3.utils.isAddress(Web3.utils.toChecksumAddress(verify));
    return true;
  }

  private saveAddress(address: string): boolean {
    Utils.localStorage.setItem(this.STORAGE_KEY, address);
    this.accountAddress = address;
    return this.isUserSignedIn();
  }
}
