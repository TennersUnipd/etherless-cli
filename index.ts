#!/usr/bin/env node

import Commander from './src/commander';
import ListCommand from './src/commands/listCommand';
import Network from './src/network';
import { RunCommand } from './src/commands/runCommand';
import AccountCreateCommand from './src/commands/createAccountCommand';
import AccountLogoutCommand from './src/commands/logoutAccountCommand';
import TestCommand from './src/commands/testCommand';

const network = new Network();

Commander.config();
Commander.addCommand(new AccountCreateCommand(network));
Commander.addCommand(new ListCommand(network));
Commander.addCommand(new TestCommand(network));
Commander.addCommand(new AccountLogoutCommand(network));
// Commander.addCommand(new TestCommand(network));
Commander.start();

// TODO: ricorda di chiamare netwrok.disconnect()

process.on('exit', () => {
  network.disconnect();
});
process.on('SIGINT', () => {
  process.exit();
});
