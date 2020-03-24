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


abstract class Network {
  /**
   * disconnect
   */
  abstract disconnect(): void;

  /**
   * getContract
   */
  abstract getContract():Contract;


  abstract getContractMethods(): string[];

  abstract accountCreate(): Account;

  abstract async executeContractMethod(func: any, cost: number): Promise<string[]>;

  abstract uploadFunction(fileBuffer: string): Promise<any>;
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: string;
}

export default Network;
