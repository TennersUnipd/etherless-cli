import { Gateway } from '../gateway';

const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');

export interface CreateFNReqData {
  name: string;
  remoteResource: string;
  description: string;
  proto: string;
  cost: number;
  file: string;
}

export function CMDCreate(gateway: Gateway, accountAddress: string, params: CreateFNReqData) {
  console.log('About to create a new function...');

  createFunction(gateway.serverlessEndpoint, params.name, params.file).then((result: any) => {
    params.remoteResource = result.data.FunctionArn;

    gateway.contract.methods.createFunction(params.name, params.description, params.proto, params.remoteResource, params.cost).send({ from: accountAddress, gas: gateway.gasLimit })
      .then((result: any) => {
      // console.log(result);
        console.log('Your function has been created');
        gateway.disconnect();
      }, (error: any) => {
        console.error('Something wrong happened');
        console.debug(error);
        gateway.disconnect();
      });
  }).catch(console.error);
}

function createFunction(endpoint: string, fnName: string, filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const zip = new AdmZip();
  zip.addFile(`${fnName}.js`, fileContent);
  const compressed = zip.toBuffer();

  return axios.post(`${endpoint}createFunction`,
    {
      zip: compressed,
      name: fnName,
    });
}
