import 'mocha';
import { assert } from 'chai';
import { mock } from 'ts-mockito';
import Web3 from 'web3';
import Ganache from 'ganache-core';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';

const transaction = {
  from: '',
  to: '',
  gas: 500 * 1.5,
  data: '',
};

const provider = Ganache.provider();
describe('Testing EtherlessSession class', async () => {
  const session:SessionInterface = new EtherlessSession(provider);
  it('testing signup method', async () => {
    const result = await session.signup('test');
    assert.isTrue(result, 'The signup method doesn\'t work');
  });
  // it('testing longon method', async () => {
  //  const result = await session.logon('344925e560943fd5b7935946529c03d2852fc19576bd77aa255ea5cdb303e03b', '');
  //  assert.isTrue(result, "The logon method doesn't work");
  // });
  it('testing logout method', () => {
    const result = session.isUserSignedIn();
    assert.isTrue(result, 'The signup method doesn\'t work');
  });
  it('testing getUserAdrres method', () => {
    const address = session.getUserAddress();
    assert.isString(address, 'the return type is wrong');
  });
  // it('testing signTransaction method', async () => {
  //   transaction.from = session.getUserAddress();
  //   transaction.to = session.getUserAddress();
  //   const result = await session.signTransaction(transaction, 'test');
  //   console.log(result);
  // });
});
