/**
 * @file etherlessNetwork.ts
 * @class EtherlessNetwork
 * @package NetworkEntities
 */
import Web3 from 'web3';

import { WebsocketProvider } from 'web3-providers-ws';

import { SignedTransaction } from 'web3-core';

import axios from 'axios';

import NetworkInterface from './networkInterface';

/**
 * @class
 * @implements NetworkInterface
 * This class implements NetworkInterface using web3
 */
export default class EtherlessNetwork extends NetworkInterface {
  private web3: Web3;

  private awsAddress: string;

  /**
   * @constructor
   * @param provider web3 instance
   * @param awsAddress lambda endpoint
   */
  public constructor(provider: any, awsAddress: string) {
    super();
    this.web3 = provider;
    this.awsAddress = awsAddress;
  }

  public disconnect(): void {
    if (this.web3.currentProvider instanceof Web3.providers.WebsocketProvider) {
      (this.web3.currentProvider as WebsocketProvider).disconnect(1000, 'execution ended');
    }
  }

  public async sendTransaction(signedTransaction: SignedTransaction): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const sentTx = this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      sentTx.on('receipt', () => {
        resolve('Request sent');
      });
      sentTx.on('error', (err) => {
        reject(err);
      });
    });
  }

  public async callMethod(callable: any): Promise<any> {
    return this.web3.eth.call(callable);
  }

  public postRequest(endpoint: string, bodyRequest: string): Promise<[number, string]> {
    return new Promise((resolve, reject) => {
      axios.post(this.awsAddress + endpoint, bodyRequest).then((response) => {
        resolve([response.status, JSON.stringify(response.data)]);
      }).catch((err) => { reject(new Error(err.toJSON().message)); });
    });
  }
}
