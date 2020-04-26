import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as variables from './SharedVariables';

const FakeProvider = require('web3-fake-provider');

const abi: AbiItem[] = variables.dummyAbi;
const fake = new FakeProvider();
const webtest = new Web3(fake);
const contract = new webtest.eth.Contract(abi, variables.contractAddress);
console.log(contract.methods);
console.log(variables.dummyAbi);
