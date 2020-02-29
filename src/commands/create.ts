import { Gateway } from '../gateway';

export function CMDCreate(gateway: Gateway, accountAddress: string, params: CreateFNReqData) {
  console.log('About to create a new function...');
  gateway.contract.methods.createFunction('0xd2D1CA60a4A33Fb0a2C3Fd6e2E22822c211c414A', params.name, params.description, params.proto, params.remoteResource, params.cost).send({ from: accountAddress, gas: gateway.gasLimit })
    .then((result: any) => {
      console.log(result);
      console.log('Your function has been created');
      gateway.disconnect();
    }, (error: any) => {
      console.error('Something wrong happened');
      console.debug(error);
      gateway.disconnect();
    });
}

export interface CreateFNReqData {
    name: string;
    remoteResource: string;
    description: string;
    proto: string;
    cost: number;
}