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

const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();

const web3:Web3 = new Web3(provider);


describe('testing the network implementation', () => {
  const network:NetworkInterface = new EtherlessNetwork(web3);

  it('testing sendTransaction', async () => {
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
      assert.equal(payload.jsonrpc, '2.0');
    });
    network.sendTransaction(transactionEmpty).then((result) => {
      console.log(result);
    }).catch((err) => {
      assert.fail('this is an error');
    });
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionReceipt');
      assert.equal(payload.jsonrpc, '2.0');
    });
  });
});
