#!/usr/bin/env node

import Commander from './CommandEntities/commander';
import AccountCreateCommand from './CommandEntities/signupCommand';
import AccountLogoutCommand from './CommandEntities/logoutCommand';
import TestCommand from './CommandEntities/testCommand';
import AccountLoginCommand from './CommandEntities/loginCommand';
import RunCommand from './CommandEntities/runCommand';
import ListCommand from './CommandEntities/listCommand';
import NetworkUtils from './NetworkEntities/NetworkUtils';

const network = NetworkUtils.getEtherlessNetworkFacadeInstance();

// TODO: add decorator
const commands = [
  // ListCommand,
  AccountCreateCommand,
  // TestCommand,
  AccountLogoutCommand,
  AccountLoginCommand,
  // RunCommand,
  TestCommand,
];

Commander.config();
commands.forEach((Item) => {
  Commander.addCommand(new Item(network));
});
Commander.start();

process.on('exit', () => {
  network.disconnect();
});
process.on('SIGINT', () => {
  process.exit();
});
