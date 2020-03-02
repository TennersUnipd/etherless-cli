import { GatewayConfiguration } from './gateway';

export enum EnvType {
    Local,
    Test,
    Stage
}
export function getConfiguration(forEnv: EnvType): GatewayConfiguration {
  switch (forEnv) {
    case EnvType.Local: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://localhost:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0xae6755b69ccF788F3Ca306C0a7Fef75Ba6730Aa7'
    };
    case EnvType.Test: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://taverna.pettinato.eu:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0x0bFC1dCDcFc3F2d6aCed8fcf04A926ce1A5866aa'
    };
    case EnvType.Stage: return {
      serverlessEndpoint: 'https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/',
      providerURI: 'ws://localhost:8545',
      abiFile: './contracts/EtherlessSmart.json',
      contractAddress: '0xae6755b69ccF788F3Ca306C0a7Fef75Ba6730Aa7'
    };
    default: throw new Error('Undefined environment');
  }
}
