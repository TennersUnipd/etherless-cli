import Web3 from 'web3';

import { WebsocketProvider } from 'web3-providers-ws';

import NetworkInterface from './networkInerface';

export default class EtherlessNetwork extends NetworkInterface {
    private web3:Web3;

    /**
     * constructor
     */
    public constructor(provider:string) {
      super(provider);
      this.web3 = new Web3(new Web3.providers.WebsocketProvider(provider));
    }

    public disconnect(): void {
      if (this.web3.currentProvider !== null) {
        (this.web3.currentProvider as WebsocketProvider).disconnect(20, 'execution ended');
      }
    }

    public sendSignedTransaction(signedtrasacion: string): Promise<any> { // check return type
      return this.web3.eth.sendSignedTransaction(signedtrasacion);
    }

    public sendTransaction(transaction: object): Promise<any> { // check return type
      return this.web3.eth.sendTransaction(transaction);
    }
}
