/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';
import { assert } from 'chai';
import Web3 from 'web3';
import EtherlessNetwork from '../../../src/NetworkEntities/etherlessNetwork';
import NetworkInterface from '../../../src/NetworkEntities/networkInterface';
import 'ethereumjs-tx';
import {
  transactionEmpty, dummyAbi, contractAddress, dummyAddress,
} from './SharedVariables';


import { ContractInterface, Transaction } from '../../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../../src/NetworkEntities/etherlessContract';

const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();

const web3: Web3 = new Web3(provider);

const contract: ContractInterface = new EtherlessContract(dummyAbi, contractAddress, web3);


describe('testing the network implementation', () => {
  const network: NetworkInterface = new EtherlessNetwork(web3);

  it('testing sendTransaction', () => {
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
      assert.equal(payload.jsonrpc, '2.0');
    });
    network.sendTransaction(transactionEmpty).then((result) => {
      console.log(result);
    }).catch((err) => {
      assert.fail('this is an error');
    });
  });
  it('testing callable()', async () => {
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call', 'Is called the wrong method from network');
    });
    const trs: Transaction = {
      from: '0x5f9fa656d0c8a61b70cd0715962dc6dbcffa356e',
      to: '0xbc8aa05e7b58f6fb53d197ee0028f987a4181ab9',
      gas: 69,
      data: '0xab7eb5e800000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a746573744a617475733200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000474657374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004746574730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047465737400000000000000000000000000000000000000000000000000000000',
    };
    await network.callMethod(trs, dummyAddress);
  });
  it('testing disconnect()', () => {
    network.disconnect();
  });
});
