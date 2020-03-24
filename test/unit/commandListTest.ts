import {
  instance, mock, when, verify,
} from 'ts-mockito';
import * as mocha from 'mocha-typescript';
import { assert } from 'chai';
import ListCommand from '../../src/commands/listCommand';
import Network from '../../src/network';
import { Command } from '../../src/commands/command';

const mockedNetwork:Network = mock(Network);


describe('ListCommand', () => {
  const network:Network = instance(mockedNetwork);
  const command:Command = new ListCommand(network);
  when(mockedNetwork.getContract).thenReturn(JSON.parse('{}'));
  when(mockedNetwork.getContractMethods).thenReturn(['method1', 'metho2']);
  console.log(network.getContractMethods);
  command.exec({});
  assert.isTrue(verify(mockedNetwork.getContractMethods).once());
});
