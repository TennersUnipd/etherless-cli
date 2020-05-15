import 'mocha';
import { assert } from 'chai';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import NetworkInterface from 'src/NetworkEntities/networkInterface';
import { ContractInterface } from 'src/NetworkEntities/contractInterface';
import SessionInterface from 'src/NetworkEntities/sessionInterface';
import EtherlessNetwork from '../src/NetworkEntities/etherlessNetwork';
import EtherlessSession from '../src/NetworkEntities/etherlessSession';
import EtherlessContract from '../src/NetworkEntities/etherlessContract';
import { NetworkFacade } from '../src/NetworkEntities/networkFacade';
import contract from './contract.json';
import { Command } from '../src/CommandEntities/command';
import { CreateCommand } from '../src/CommandEntities/createCommand';
import DeleteCommand from '../src/CommandEntities/deleteCommand';
import FindCommand from '../src/CommandEntities/findCommand';
import ListCommand from '../src/CommandEntities/listCommand';
import LogCommand from '../src/CommandEntities/logCommand';
import AccountLoginCommand from '../src/CommandEntities/loginCommand';
import AccountLogoutCommand from '../src/CommandEntities/logoutCommand';
import RunCommand from '../src/CommandEntities/runCommand';
import SetCommand from '../src/CommandEntities/setCommand';
import AccountCreateCommand from '../src/CommandEntities/signupCommand';
import { UpdateCommand } from '../src/CommandEntities/updateCommand';
import NetworkUtils from '../src/NetworkEntities/networkUtils';

import FakeProvider = require('web3-fake-provider');

const userAddress = '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8';
const contactAdresses = '0xA3865FBE59d6d20647688040f604eEa680D0df32';

describe('Integration Test', () => {
  const contractObject = contract;
  let provider;
  let web3Instance: Web3;
  let networkInstance: NetworkInterface;
  let sessionInstance: SessionInterface;
  let contractInstance: ContractInterface;
  let NetworkFacadeInstance: NetworkFacade;

  beforeEach(() => {
    provider = new FakeProvider();
    web3Instance = new Web3(provider);
    networkInstance = new EtherlessNetwork(web3Instance, 'http://localhost:8080/');
    sessionInstance = new EtherlessSession(web3Instance);
    contractInstance = new EtherlessContract(contractObject as unknown as AbiItem[],
      userAddress,
      web3Instance);
    NetworkFacadeInstance = new NetworkFacade(
      networkInstance,
      sessionInstance,
      contractInstance,
    );
  });

  afterEach(() => {
    NetworkFacadeInstance.disconnect();
  });

  const logout = (): void => { sessionInstance.logout(); };

  it('integration test of singup command', () => {
    try {
      sessionInstance.logout();
    } catch (err) {
      // console.log(err);
    }
    const command: Command = new AccountCreateCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs(['password']))
      .then((result) => assert.ok(result))
      .catch((err) => console.log(err.message));
    logout();
  });
  it('integration test of login command', () => {
    try {
      sessionInstance.logout();
    } catch (err) {
      // console.log(err);
    }
    const command: Command = new AccountLoginCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs(['0x5f4fb1c745707fcea932403a5268dfecd2d6b0b26e5cbfe0db70dc581ae718db', 'password']))
      .then((result) => assert.ok(result))
      .catch((err) => console.log(err.message));
  });
  it('integration test of list command', () => {
    provider.injectResult(20);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e8dfcf94ac7a84219f979e48a5a9ff8d5531e8080000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000966756e6350726f76610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001166756e7a696f6e652064692070726f7661000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000828696e742e2e2e29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004561726e3a6177733a6c616d6264613a75732d656173742d313a3331363331353239353138383a66756e6374696f6e3a627137367866346e6a3363766937376f3632376a336f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000ec4c7dba040ae315603618984279d23de13c88040000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000770656e64696e6700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000770656e64696e6700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000770656e64696e6700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004361726e3a6177733a6c616d6264613a75732d656173742d313a3331363331353239353138383a66756e6374696f6e3a6778616b757a6b65326671693168736334347273000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000e8dfcf94ac7a84219f979e48a5a9ff8d5531e8080000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000a66756e6350726f7661320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046465736300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000570726f746f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004561726e3a6177733a6c616d6264613a75732d656173742d313a3331363331353239353138383a66756e6374696f6e3a7a6267336862386d6f30726832316e7468307672746d000000000000000000000000000000000000000000000000000000');
    provider.injectValidation(((payload) => {
      assert.equal(payload.method, 'eth_call');
    }));
    const command: Command = new ListCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs([]))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err.message));
  });
  it('integration test of create command', () => {
    const command: Command = new CreateCommand(NetworkFacadeInstance);
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_chainId');
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_gasPrice');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionCount');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
    });
    provider.injectResult('0x9b149f57618d5d5368b296b58d0e5df29eab93c0fa50e5b89afe611e1c323fa4');
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionReceipt');
    });
    command.exec(command.parseArgs(['name', 'description', 'prototype', '10', './tests/dummy.js', 'password']))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err));
  });
  it('integration test of find command', () => {
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_chainId');
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_gasPrice');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionCount');
    });
    provider.injectResult('0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000e8dfcf94ac7a84219f979e48a5a9ff8d5531e8080000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000966756e6350726f76610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001166756e7a696f6e652064692070726f7661000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000828696e742e2e2e29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004561726e3a6177733a6c616d6264613a75732d656173742d313a3331363331353239353138383a66756e6374696f6e3a627137367866346e6a3363766937376f3632376a336f000000000000000000000000000000000000000000000000000000');
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call');
    });
    const command: Command = new FindCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs(['funcProva']))
      .then((result) => assert.ok(result))
      .catch((err) => console.log(err.message));
  });
  it('integration tests log command', () => {
    const command: Command = new LogCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs([]))
      .then((result) => assert.ok(result))
      .catch((err) => console.log(err.message));
  });
  it('integration test of delete command', () => {
    const command: Command = new DeleteCommand(NetworkFacadeInstance);
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(web3Instance.eth.abi.encodeParameter('string', 'realArn'));
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call');
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_chainId');
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_gasPrice');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionCount');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
    });
    provider.injectResult('0x9b149f57618d5d5368b296b58d0e5df29eab93c0fa50e5b89afe611e1c323fa4');
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionReceipt');
    });
    command.exec(command.parseArgs(['funcProva', 'password']))
      .then((result) => assert.ok(result))
      .catch((err) => console.log(err.message));
  });
  it('integration test of Run command', () => {
    const command: Command = new RunCommand(NetworkFacadeInstance);
    provider.injectResult(5000000000);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(web3Instance.eth.abi.encodeParameter('uint256', '15'));
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call');
    });
    provider.injectResult(5000000000);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectValidation((payload) => {
      console.log(payload);
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_gasPrice');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionCount');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
    });
    provider.injectResult('0x9b149f57618d5d5368b296b58d0e5df29eab93c0fa50e5b89afe611e1c323fa4');
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionReceipt');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_subscribe');
    });
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_chainId');
    });
    command.exec(command.parseArgs(['funcProva', 'password', 'value']))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err));
  });
  it('integration test of set command', () => {
    const command: Command = new SetCommand(NetworkFacadeInstance);
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_chainId');
    });
    provider.injectResult(30008);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_gasPrice');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionCount');
    });
    provider.injectResult(3);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_sendRawTransaction');
    });
    provider.injectResult('0x9b149f57618d5d5368b296b58d0e5df29eab93c0fa50e5b89afe611e1c323fa4');
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_getTransactionReceipt');
    });
    command.exec(command.parseArgs(['name', 'description', 'value', 'password']))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err));
  });
  it('integration test of update command', () => {
    provider.injectResult(20);
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_estimateGas');
    });
    provider.injectResult(web3Instance.eth.abi.encodeParameter('string', 'realArn'));
    provider.injectValidation((payload) => {
      assert.equal(payload.method, 'eth_call');
    });
    const command: Command = new UpdateCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs(['functionName', './tests/dummy.js', 'password']))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err.message));
  });
  it('integration test of logout command', () => {
    const command: Command = new AccountLogoutCommand(NetworkFacadeInstance);
    command.exec(command.parseArgs([]))
      .then((result) => assert.ok(result))
      .catch((err) => assert.fail(err.message));
  });
});
