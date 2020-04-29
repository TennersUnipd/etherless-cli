import Web3 from 'web3';

import axios from 'axios';

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
      console.log(userAddress);
      let attheend = await axios.get(`https://api-ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${userAddress}&apikey=${process.env.ETHSCAN}`)
      /*let accountAddress = this.session.getUserAddress();
      let logToDecode = await this.network.getLog(accountAddress);
      let attheend = await this.contract.getDecodeLog(logToDecode);*/
      console.log(attheend);
      console.log(attheend.data.result[0].transactionHash);
      console.log(this.web3.utils.hexToNumber(attheend.data.result[0].gasUsed)+'GAS');
      let date = new Date(attheend.data.result[0].timeStamp*1000);
      console.log(date);
      return attheend.data.result[0].data;
    }
}
