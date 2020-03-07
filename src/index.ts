#!/usr/bin/env node
import { CMDList } from './commands/list';
import { CMDCreate, CreateFNReqData } from './commands/create';
import { EnvType, getConfiguration} from './configurator';
import { Gateway } from './gateway';
import { RunFNData, CMDRun } from './commands/run';

const fetch = require('node-fetch');


require('dotenv').config();

const program = require('commander');
const fs = require('fs');

const environment: EnvType = EnvType.Local;

const etherescanUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${process.env.CONTRACT}&apikey=${process.env.ETHSCAN}`;

const getAbi = async ():Promise<JSON> => {
  const resp = await fetch(etherescanUrl);
  const respJSON = await resp.json();
  const contractABIString = await respJSON.result;
  const contractABIObj:JSON = JSON.parse(contractABIString);
  return contractABIObj;
};

const getGate = async (env: EnvType):Promise<Gateway> => {
  const config = getConfiguration(env);
  if (env === EnvType.Infura) {
    return Gateway.build(config, getAbi());
  }
  return Gateway.build(config);
};

const gate = getGate(environment);
program
  .version('0.0.1')
  .description('Etherless CLI');

program
  .command('list')
  .alias('l')
  .description('List all available functions')
  .action(() => {
    gate
      .then((result:Gateway) => CMDList(result, result.testAccount))
      .catch(console.error);
  });

program
  .command('create <name> <description> <prototype> <cost> <file>')
  .alias('c')
  .description('Create a new function')
  .action((name: string, description: string, prototype: string, cost: number, file: string) => {
    // TODO: check inputs

    // check if file exists
    if (!fs.existsSync(file)) {
      console.error('Function file not found');
      return;
    }

    const params: CreateFNReqData = {
      name,
      remoteResource: '',
      description,
      proto: prototype,
      cost,
      file,
    };

    gate
      .then((result:Gateway) => CMDCreate(result, result.testAccount, params))
      .catch(console.error);
  });

program
  .command('run <functionName> [parameters...]')
  .alias('r')
  .description('Request function execution')
  .action((name: string, parameters: string[]) => {
    // TODO: check inputs
    const params: RunFNData = {
      name,
      parameters,
    };
    console.log(params);
    gate
      .then((result:Gateway) => CMDRun(result, result.testAccount, params))
      .catch(console.error);
  });

program.parse(process.argv);


process.on('exit', () => {
  gate
    .then((result:Gateway) => result.disconnect())
    .catch(console.error);
});
process.on('SIGINT', () => {
  process.exit();
});
