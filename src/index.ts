#!/usr/bin/env node

import Commander from './CommandEntities/commander';
import { CreateCommand } from './CommandEntities/createCommand';
import FindCommand from './CommandEntities/findCommand';
import ListCommand from './CommandEntities/listCommand';
import AccountLoginCommand from './CommandEntities/loginCommand';
import AccountLogoutCommand from './CommandEntities/logoutCommand';
import RunCommand from './CommandEntities/runCommand';
import AccountCreateCommand from './CommandEntities/signupCommand';
import UpdateCommand from './CommandEntities/updateCommand';
import NetworkUtils from './NetworkEntities/networkUtils';
import SetCommand from './CommandEntities/setCommand';
import DeleteCommand from './CommandEntities/deleteCommand';
import LogCommand from './CommandEntities/logCommand';

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
  UpdateCommand,
  SetCommand,
  DeleteCommand,
  LogCommand
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
