import DOTENV from 'dotenv-flow';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { WebsocketProvider } from 'web3-providers-ws';
import { AbiItem } from 'web3-utils';
import axios, { AxiosResponse } from 'axios';
import { Account } from 'web3-core';
import { Accounts } from 'web3-eth-accounts';
import SessionManager from './sessionManager';
import Utils from './utils';

const fs = require('fs');

let envConfig = {};
if (process.argv.indexOf('--dev') > -1) {
  envConfig = { node_env: 'development' };
}
DOTENV.config(envConfig);


class Network {
    private contract: Contract;

    private web3: Web3;

    public static instance: Network;

    public static getInstance(): Network {
      if (!Network.instance) {
        Network.instance = new Network();
      }
      return Network.instance;
    }

    private constructor() {
      if (process.env.PROVIDER_API === undefined) {
        throw new Error('Inavalid network provider url');
      }
      if (process.env.CONTRACT_ADDRESS === undefined) {
        throw new Error('Inavalid contract address');
      }
      if (process.env.ABI_PATH === undefined) {
        throw new Error('Inavalid abi path');
      }

      if (process.env.CONTRACT_ADDRESS !== Utils.localStorage.getItem('lastAbiAddress')) {
        Network.updateAbi(process.env.CONTRACT_ADDRESS, process.env.ABI_PATH);
        Utils.localStorage.setItem('lastAbiAddress', process.env.CONTRACT_ADDRESS);
      }

      this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER_API));
      // this.web3.eth.accounts = new Accounts(process.env.PROVIDER_API);
      this.contract = new this.web3.eth.Contract(Network.getAbi(), process.env.CONTRACT_ADDRESS);
    }

    private static async updateAbi(contractAddress: string, destinationPath: string) {
      try {
        console.log('DOWNLOADING contract abi');
        const response: AxiosResponse<EtherscanResponse> = await axios.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCAN}`);
        fs.writeFileSync(destinationPath, response.data.result);
      } catch (error) {
        throw new Error('Unable to update contract ABI');
      }
    }

    private static getAbi() : AbiItem {
      const parsed = JSON.parse(fs.readFileSync(process.env.ABI_PATH));
      return parsed;
    }

    disconnect() {
      if (this.web3.currentProvider !== null) {
        (this.web3.currentProvider as WebsocketProvider).disconnect(20, 'execution ended');
      }
    }

    ethPrivateKeyToAccount(key: string): Account {
      return this.web3.eth.accounts.privateKeyToAccount(key);
    }

    getContract(): Contract {
      return this.contract;
    }

    getContractMethods(): any {
      return this.contract?.methods;
    }

    accountCreate(): Account {
      return this.web3.eth.accounts.create();
    }

    private static ethNetworkCallerAddress(): string {
      const account = SessionManager.getInstance().user;
      if (account === undefined) {
        throw new Error('No user logged');
      }
      return account.address;
    }

    // eslint-disable-next-line class-methods-use-this
    callContractMethod(func: Function): Promise<any> {
      const caller = Network.ethNetworkCallerAddress();
      return func.call({ from: caller });
    }

    async transactContractMethod(func: any, cost: number = 0): Promise<any> {
      // TODO: move to session manager
      const account = SessionManager.getInstance().user;
      if (account === undefined) {
        throw new Error('No user logged');
      }
      func.call({ from: account.address })
        .then((results: any) => {
          console.log(results);

          this.disconnect();
        }, (error: any) => {
          console.error('Something wrong happened');
          console.error(error);
        });
      // const nonce = await this.web3.eth.getTransactionCount(account.address, 'pending');
      // let estimatedGas = await func
      //   .estimateGas({ from: account.address, gas: '10000000', value: '100000000000000000' });
      // const estimatedGas = Math.round(100000000000000000 * 1.5);
      // const tx = {
      //   // this could be provider.addresses[0] if it exists
      //   from: account.address,
      //   // target address, this could be a smart contract address
      //   to: this.contract.options.address,
      //   // optional if you want to specify the gas limit
      //   gas: 1000000,
      //   // this encodes the ABI of the method and the arguements
      //   data: func.encodeABI(),
      // };
      // const signPromise = this.web3.eth.accounts.signTransaction(tx, account.privateKey);
      // signPromise.then((signedTx) => {
      //   console.log('1');
      //   // raw transaction string may be available in .raw or
      //   // .rawTransaction depending on which signTransaction
      //   // function was called
      //   console.log('SIGNED TX', signedTx);
      //   const raw = signedTx.rawTransaction;
      //   if (raw === undefined) {
      //     throw new Error('Awesome error');
      //   }
      //   const sentTx = this.web3.eth.sendSignedTransaction(raw);
      //   sentTx.on('receipt', (receipt) => {
      //     // do something when receipt comes back
      //     this.web3.eth.call(receipt).then((buh: any) => {
      //       console.log('COCO', buh);
      //     });
      //     console.log('RECEIPT', receipt);
      //   });
      //   sentTx.on('error', (err) => {
      //     // do something on transaction error
      //     console.log('error HERE', err);
      //   });
      // }).catch((err) => {
      //   // do something when promise fails
      //   console.log(err);
      // });
      // return signPromise;
    }

    static uploadFunction(fileBuffer: string): Promise<any> {
      if (SessionManager.getInstance().userLogged() === false) {
        throw new Error('No user logged');
      }

      return axios.post(`${process.env.AWS_ENDPOINT}createFunction`,
        {
          zip: fileBuffer,
          name: Utils.randomString(),
        });
    }
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

export default Network;
