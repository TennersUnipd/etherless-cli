import 'mocha';

import { assert } from 'chai';

import Web3 from 'web3';

import NetworkComponentsFacade from '../../src/NetworkEntities/NetworkFacade';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';

const endpoint = 'http://127.0.0.1:7545';
// const envConfig = { node_env: 'development1' };
// DOTENV.config(envConfig);
const network: NetworkInterface = new EtherlessNetwork(endpoint);
const session: SessionInterface = new EtherlessSession(endpoint);
const contract: ContractInterface = new EtherlessContract(NetworkUtils
  .getAbi(process.env.ABI_PATH), process.env.CONTRACT_ADDRESS, endpoint);
describe('testint networkFacade interface', () => {
  const networkF: NetworkComponentsFacade = new NetworkComponentsFacade(network, session, contract);
  it('testing signup', async () => {
    const result = await networkF.signup('test1');
    assert.isTrue(result, 'signup does not working');
    console.log(session.getUserAddress());
  });
  //   it('testing login', async () => {
  //     const result = networkF.logon('0x72A5B4C1e8E60D0E59f0A0931136593979500691', 'pp');
  //     assert.isTrue(result, 'login is not working');
  //   });
  it('testing getListOfFunctions', () => {
    const result = networkF.getListOfFunctions();
    result.forEach((elements) => {
      console.log(elements);
    });
    assert.isArray(result, 'getListOfFunctions is not working');
  });
});
