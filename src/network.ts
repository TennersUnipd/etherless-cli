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

    private sessionManager = SessionManager.getInstance();

    constructor() {
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
      this.disconnect();
    }

    private static async updateAbi(contractAddress: string, destinationPath: string) {
      try {
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

    getContract(): Contract {
      return this.contract;
    }

    getContractMethods(): any {
      return this.contract?.methods;
    }

    accountCreate(): Account {
      return this.web3.eth.accounts.create();
    }

    async executeContractMethod(func: any, cost: number = 0): Promise<string[]> {
      // TODO: move to session manager
      const wallet = this.web3.eth.accounts.wallet.load('password');
      const account: Account = wallet[0];
      console.log('DSAD ASDSAD AS DAS||', account);

      if (this.sessionManager.userLogged() === false) {
        throw new Error('No user logged');
      }
      const nonce = await this.web3.eth.getTransactionCount(account.address, 'pending');
      let estimatedGas = await func
        .estimateGas({ from: account.address, gas: '10000000', value: '100000000000000000' });
      estimatedGas = Math.round(estimatedGas * 1.5);

      return func.send({
        from: this.sessionManager.user?.address, nonce, value: cost, gas: estimatedGas,
      });
    }

    uploadFunction(fileBuffer: string): Promise<any> {
      if (this.sessionManager.userLogged() === false) {
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
