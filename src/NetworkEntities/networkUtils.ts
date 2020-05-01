import DOTENV from 'dotenv-flow';

import { AbiItem } from 'web3-utils';

import axios, { AxiosResponse } from 'axios';

import Web3 from 'web3';

import fs from 'fs';
import Utils from '../utils';

import { NetworkFacade } from './networkFacade';
import EtherlessContract from './etherlessContract';
import EtherlessNetwork from './etherlessNetwork';
import EtherlessSession from './etherlessSession';


let envConfig = {};
if (process.argv.includes('--dev')) {
  envConfig = { node_env: 'development' };
}
DOTENV.config(envConfig);

export interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}
export default class NetworkUtils {
  static facade: NetworkFacade;

  /**
   * @function getEtherlessNetworkFacadeInstance
   *  this method initialize the NetworkFacade and returns an instance
   */
  static getEtherlessNetworkFacadeInstance(): NetworkFacade {
    if (this.facade === undefined) {
      this.checkAbiUpdate(process.env.CONTRACT_ADDRESS);
      const provider = new Web3(process.env.PROVIDER_API);
      const eNetwork: EtherlessNetwork = new EtherlessNetwork(provider, process.env.AWS_ENDPOINT);
      const eContract: EtherlessContract = new EtherlessContract(
        NetworkUtils.getAbi(process.env.ABI_PATH),
        process.env.CONTRACT_ADDRESS,
        provider,
      );
      const eSession: EtherlessSession = new EtherlessSession(provider);
      this.facade = new NetworkFacade(eNetwork, eSession, eContract);
    }
    return this.facade;
  }

  /**
   * @function checkAbiUpdate
   * @param contractAddress
   *  this method checks if it is necessary update the local ABI file
   * @callback updateAbi
   */
  private static checkAbiUpdate(contractAddress: string): void {
    if (contractAddress !== Utils.localStorage.getItem('lastAbiAddress')) {
      NetworkUtils.updateAbi(process.env.CONTRACT_ADDRESS, process.env.ABI_PATH);
      Utils.localStorage.setItem('lastAbiAddress', process.env.CONTRACT_ADDRESS);
    }
  }

  /**
   * @function updateAbi
   * @param contractAddress
   * @param destinationPath
   *  this method downloads the new ABI file from etherscan.io
   */
  private static async updateAbi(contractAddress: string, destinationPath: string) {
    try {
      console.log('DOWNLOADING contract abi');
      const response: AxiosResponse<EtherscanResponse> = await axios.get(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHSCAN}`);
      fs.writeFileSync(destinationPath, response.data.result, { flag: 'w' });
    } catch (error) {
      throw new Error('Unable to update contract ABI');
    }
  }

  /**
   * @function getAbi
   * @param abiPath
   *  this method loads the ABI file from local storage
   */
  public static getAbi(abiPath: string): AbiItem[] {
    try {
      const parsed = JSON.parse(fs.readFileSync(abiPath).toString('utf-8'));
      return parsed;
    } catch (error) {
      // TODO: Mocked AbiFile
      return [
        {
          inputs: [],
          name: 'retrieve',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'num',
              type: 'uint256',
            },
          ],
          name: 'store',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
    }
  }
}
