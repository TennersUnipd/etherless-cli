#!/usr/bin/env node

import Commander from './src/commander';
import ListCommand from './src/commands/listCommand';
import AccountCreateCommand from './src/commands/signupCommand';
import AccountLogoutCommand from './src/commands/logoutCommand';
import TestCommand from './src/commands/testCommand';
import AccountLoginCommand from './src/commands/loginCommand';
import RunCommand from './src/commands/runCommand';
import ContractProxy from './src/contractProxy/contractProxy'
import EtherlessContract from './src/contractProxy/etherlessContract'
import Network from './src/contractProxy/network';

Commander.config();
Commander.addCommand(new AccountCreateCommand());
Commander.addCommand(new ListCommand());
Commander.addCommand(new TestCommand());
Commander.addCommand(new AccountLogoutCommand());
Commander.addCommand(new AccountLoginCommand());
// Commander.addCommand(new RunCommand());
// Commander.addCommand(new TestCommand(network));
Commander.start();
// TODO: ricorda di chiamare netwrok.disconnect()
process.on('exit', () => {
  Network.getInstance().disconnect();
});
process.on('SIGINT', () => {
  process.exit();
});
