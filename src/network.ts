import DOTENV from 'dotenv-flow';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { WebsocketProvider } from 'web3-providers-ws';
import { AbiItem } from 'web3-utils';
import axios, { AxiosResponse } from 'axios';
import SessionManager from './sessionManager';
import Utils from './utils';

const fs = require('fs');
const LS = require('node-localstorage').LocalStorage;

const localStorage = new LS('./uweirb3');

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

      if (process.env.CONTRACT_ADDRESS !== localStorage.getItem('lastAbiAddress')) {
        Network.updateAbi(process.env.CONTRACT_ADDRESS, process.env.ABI_PATH);
        localStorage.setItem('lastAbiAddress', process.env.CONTRACT_ADDRESS);
      }

      this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER_API));
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

    executeContractMethod(func: any, cost: number = 0): Promise<string[]> {
      if (this.sessionManager.userLogged() === false) {
        throw new Error('No user logged');
      }

      return func.call({ from: this.sessionManager.user?.accountAddress, value: cost });
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
