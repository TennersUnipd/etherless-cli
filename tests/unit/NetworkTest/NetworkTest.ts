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
  const network: NetworkInterface = new EtherlessNetwork(web3, 'fake');

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
  it('testing callable()', () => {
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call');
    });
    const callable = contract.getCallable('listFunctions', []);
    network.callMethod(callable, dummyAddress).then((result) => {
      assert.isNull(result, 'the return is wrong');
    }).catch((err) => {
      assert.fail('the network doesn\'t send the right method');
    })
  })
  it('testing disconnect()', () => {
    network.disconnect();
  });
});
