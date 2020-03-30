import Web3 from 'web3';

import { WebsocketProvider } from 'web3-providers-ws';

import NetworkInterface from './networkInerface';

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

    public sendSignedTransaction(signedtrasacion: any):Promise<any> { // check return type
      return this.web3.eth.sendSignedTransaction(signedtrasacion.toString())
        .on('error', console.error)
        .then((data) => data)
        .catch((err) => Promise.reject(err));
    }

    public async sendTransaction(transaction: any):Promise<any> { // check return type
      return this.web3.eth.sendTransaction(transaction)
        .on('error', console.error)
        .then((data) => data)
        .catch((err) => Promise.reject(err));
    }
}
