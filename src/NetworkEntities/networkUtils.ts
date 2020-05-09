/**
 * @class NetworkUtils
 * This staic class is a utility class that inizialize the NetworkFacade
 */
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import axios from 'axios';
import Utils from '../utils';
import { NetworkFacade } from './networkFacade';
import EtherlessContract from './etherlessContract';
import EtherlessNetwork from './etherlessNetwork';
import EtherlessSession from './etherlessSession';

/**
 * @class NetworkUtils
 * This staic class is a utility class that inizialize the NetworkFacade
 */
export default class NetworkUtils {
  static facade: NetworkFacade;

  /**
   * @function getEtherlessNetworkFacadeInstance
   * @returns instance of @NetworkFace
   * this method initialize the NetworkFacade and returns an instance
   */
  static getEtherlessNetworkFacadeInstance(): Promise<NetworkFacade> {
    if (this.facade === undefined) {
      return NetworkUtils.getAbi(Utils.config.CONTRACT_ADDRESS).then((contract) => {
        const provider = new Web3(Utils.config.PROVIDER_API);
        const eNetwork: EtherlessNetwork = new EtherlessNetwork(provider,
          Utils.config.AWS_ENDPOINT);
        const eContract: EtherlessContract = new EtherlessContract(
          contract as unknown as AbiItem[],
          Utils.config.CONTRACT_ADDRESS,
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
   * @param contractAddress contract address to download
   * @param destinationPath where the ABI will be saved
   * @return
   *  this method downloads the new ABI file from etherscan.io
   */
  private static async updateAbi(contractAddress: string, destinationPath: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      console.log('DOWNLOADING contract abi');
      const params = {
        module: 'contract',
        action: 'getabi',
        address: contractAddress,
        apikey: Utils.config.ETHSCAN,
      };
      axios.get('https://api-ropsten.etherscan.io/api', { params }).then((response) => {
        if (response.data.result === 'Invalid API Key') reject(new Error(response.data.result));
        Utils.localStorage.setItem(destinationPath, response.data.result);
        Utils.localStorage.setItem('lastAbiAddress', contractAddress);
        const contractJson = Utils.localStorage.getItem(destinationPath);
        try {
          resolve(JSON.parse(contractJson));
        } catch (err) {
          reject(new Error(contractJson));
        }
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * @function getAbi
   * @param contractAddress contract address to download
   * @returns a Promise<JSON> that represents the ABI file
   * This function checks if the ABI is due for an update or returs the local one
   */
  public static getAbi(contractAddress: string): Promise<JSON> {
    if (contractAddress !== Utils.localStorage.getItem('lastAbiAddress')) {
      return this.updateAbi(contractAddress, 'contract');
    }
    return new Promise((resolve, reject) => {
      const contractJson = Utils.localStorage.getItem('contract');
      try {
        const contract = JSON.parse(contractJson);
        if (contract === null) reject(new Error('Empty local ABI'));
        resolve(contract);
      } catch (err) {
        reject(new Error(contractJson));
      }
    });
  }
}
