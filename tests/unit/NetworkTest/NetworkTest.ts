/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert } from 'chai';

import Web3 from 'web3';

import EtherlessNetwork from '../../../src/NetworkEntities/etherlessNetwork';

import NetworkInterface from '../../../src/NetworkEntities/networkInterface';

import * as sv from './SharedVariables';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();

const web3: Web3 = new Web3(provider);

describe('testing the network implementation', () => {
  const network: NetworkInterface = new EtherlessNetwork(web3, 'fake');

  it('testing sendTransaction', () => {
    network.sendTransaction(sv.transactionEmpty).then((result) => {
      assert.ok(result, 'This is not ok');
    }).catch((err) => {
      assert.fail('sendTransaction fails because ', err);
    });
  });
  it('testing callable()', () => {
    network.callMethod(sv.transactionEmpty).then((result) => {
      assert.isNull(result, 'the return is wrong');
    }).catch((err) => {
      assert.fail(err);
    });
  });
  it('testing disconnect()', () => {
    network.disconnect();
  });
});
