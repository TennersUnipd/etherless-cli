import Web3 from 'web3';

import { WebsocketProvider } from 'web3-providers-ws';

import { SignedTransaction, Log } from 'web3-core';
import NetworkInterface from './networkInterface';

export default class EtherlessNetwork extends NetworkInterface {
    private web3:Web3;

    /**
     * constructor
     */
    public constructor(provider:string|any) {
      super(provider);
      this.web3 = provider;
    }

    public disconnect(): void {
      if (this.web3.currentProvider instanceof Web3.providers.WebsocketProvider) {
        (this.web3.currentProvider as WebsocketProvider).disconnect(20, 'execution ended');
      }
    }

    public async sendTransaction(signedTransaction: SignedTransaction):Promise<any> { // check return type
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

    // eslint-disable-next-line class-methods-use-this
    public async callMethod(callable:any, address:string):Promise<any> {
      return callable.call({ from: address });
    }

    public async getLog(userAddress:string) : Promise<any>{
        let logs = await this.web3.eth.getPastLogs({ address: '0x6F9954E183b86B289aFe9f04E7cF60Af0c410a6B', fromBlock:0 , toBlock: 'latest'});
        console.log(logs);
        let toBeReturned: string[] = new Array;
        logs.forEach(element => {
          toBeReturned.push(element.topics[0]);
        });
        return toBeReturned;
    }
}
