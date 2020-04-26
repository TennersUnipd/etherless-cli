#!/usr/bin/env node

import Commander from './CommandEntities/commander';
import AccountCreateCommand from './CommandEntities/signupCommand';
import AccountLogoutCommand from './CommandEntities/logoutCommand';
import AccountLoginCommand from './CommandEntities/loginCommand';
import RunCommand from './CommandEntities/runCommand';
import ListCommand from './CommandEntities/listCommand';
import NetworkUtils from './NetworkEntities/networkUtils';
import { CreateCommand } from './CommandEntities/createCommand';
import FindCommand from './CommandEntities/findCommand';
import SetCommand from './CommandEntities/setCommand';
import DeleteCommand from './CommandEntities/deleteFunction';

const network = NetworkUtils.getEtherlessNetworkFacadeInstance();

// TODO: add decorator
const commands = [
  ListCommand,
  AccountCreateCommand,
  FindCommand,
  // TestCommand,
  AccountLogoutCommand,
  AccountLoginCommand,
  RunCommand,
  CreateCommand,
  SetCommand,
  DeleteCommand
  // TestCommand,
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
