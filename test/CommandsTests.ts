/*global describe, it*/
/*eslint no-undef: "error"*/
import { CMDCreate, CreateFNReqData } from '../src/commands/create';
import { CMDList } from '../src/commands/list';
import { CMDrun, RunFNData } from '../src/commands/run';
import { Gateway, GatewayConfiguration } from '../src/gateway';

const testConfig: GatewayConfiguration = {
  providerURI: 'ws://127.0.0.1:7545',
  abiFile: './contracts/EtherlessSmart.json',
  contractAddress: '0xF551Ee49B1F0Cf24D5E9263d73E143c86945CdFB',
};

const gateway: Gateway = new Gateway(testConfig);

describe('Testing CMDCreate', () => {
  it('testing CMD create', () => {
    const params: CreateFNReqData = {
      name: 'Test',
      remoteResource: '',
      description: 'This is a test',
      proto: 'TestValue',
      cost: 10,
    };
    CMDCreate(gateway, '0xA072051e4b49b7D51ee4C58d3DaBC80d309f945E', params);
  });
  it('testing CMD List', () => {
    CMDList(gateway, '0xA072051e4b49b7D51ee4C58d3DaBC80d309f945E');
  });
  it('testing CMD run', () => {
  });
});
