import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import axios from 'axios';
import Utils from '../utils';
import { NetworkFacade } from './networkFacade';
import EtherlessContract from './etherlessContract';
import EtherlessNetwork from './etherlessNetwork';
import EtherlessSession from './etherlessSession';

export interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}
export default class NetworkUtils {
  static facade: NetworkFacade;

  /**
   * @function getEtherlessNetworkFacadeInstance
   * @returns {NetworkFacade} instance
   *  this method initialize the NetworkFacade and returns an instance
   */
  static getEtherlessNetworkFacadeInstance(): Promise<NetworkFacade> {
    if (this.facade === undefined) {
      return NetworkUtils.getAbi(process.env.CONTRACT_ADDRESS).then((contract) => {
        const provider = new Web3(process.env.PROVIDER_API);
        const eNetwork: EtherlessNetwork = new EtherlessNetwork(provider, process.env.AWS_ENDPOINT);
        const eContract: EtherlessContract = new EtherlessContract(
          contract as unknown as AbiItem[],
          process.env.CONTRACT_ADDRESS,
          provider,
        );
        const eSession: EtherlessSession = new EtherlessSession(provider);
        this.facade = new NetworkFacade(eNetwork, eSession, eContract);
        return this.facade;
      }).catch((err) => {
        throw err;
      });
    }
    return new Promise((resolve) => { resolve(this.facade); });
  }

  /**
   * @function updateAbi
   * @param contractAddress
   * @param destinationPath
   *  this method downloads the new ABI file from etherscan.io
   */
  private static async updateAbi(contractAddress: string, destinationPath: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      console.log('DOWNLOADING contract abi');
      const params = {
        module: 'contract',
        action: 'getabi',
        address: contractAddress,
        apikey: process.env.ETHSCAN,
      };
      axios.get('https://api-ropsten.etherscan.io/api', { params }).then((response) => {
        if (response.data.result === 'Invalid API Key') reject(new Error(response.data.result));
        Utils.localStorage.setItem(destinationPath, response.data.result);
        Utils.localStorage.setItem('lastAbiAddress', contractAddress);
        const cntrc = Utils.localStorage.getItem(destinationPath);
        console.log(cntrc);
        try {
          resolve(JSON.parse(cntrc));
        } catch (err) {
          reject(new Error(cntrc));
        }
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * @function getAbi
   * @param {string} contractAddress contract address to download
   * @returns {Promise<JSON>}
   * this method loads the ABI file from local storage
   */
  public static getAbi(contractAddress: string): Promise<JSON> {
    if (contractAddress !== Utils.localStorage.getItem('lastAbiAddress')) {
      return this.updateAbi(contractAddress, 'contract');
    }
    return new Promise((resolve, reject) => {
      const cntrc = Utils.localStorage.getItem('contract');
      try {
        const contract = JSON.parse(cntrc);
        if (contract === null) reject(new Error('Empty local ABI'));
        resolve(contract);
      } catch (err) {
        reject(new Error(cntrc));
      }
    });
  }
}
