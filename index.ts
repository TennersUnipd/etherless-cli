#!/usr/bin/env node

import Commander from './src/commander';
import ListCommand from './src/commands/listCommand';
import Network from './src/network';
import AccountCreateCommand from './src/commands/signupCommand';
import AccountLogoutCommand from './src/commands/logoutCommand';
import TestCommand from './src/commands/testCommand';
import AccountLoginCommand from './src/commands/loginCommand';
import RunCommand from './src/commands/runCommand';
import FindCommand from './src/commands/findCommand';


Commander.config();
Commander.addCommand(new AccountCreateCommand());
Commander.addCommand(new ListCommand());
Commander.addCommand(new TestCommand());
Commander.addCommand(new AccountLogoutCommand());
Commander.addCommand(new AccountLoginCommand());
Commander.addCommand(new FindCommand());
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
