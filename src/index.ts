#!/usr/bin/env node
import Commander from './CommandEntities/commander';
import { CreateCommand } from './CommandEntities/createCommand';
import DeleteCommand from './CommandEntities/deleteCommand';
import FindCommand from './CommandEntities/findCommand';
import ListCommand from './CommandEntities/listCommand';
import LogCommand from './CommandEntities/logCommand';
import AccountLoginCommand from './CommandEntities/loginCommand';
import AccountLogoutCommand from './CommandEntities/logoutCommand';
import RunCommand from './CommandEntities/runCommand';
import SetCommand from './CommandEntities/setCommand';
import AccountCreateCommand from './CommandEntities/signupCommand';
import { UpdateCommand } from './CommandEntities/updateCommand';
import { NetworkFacade } from './NetworkEntities/networkFacade';
import NetworkUtils from './NetworkEntities/networkUtils';

NetworkUtils.getEtherlessNetworkFacadeInstance()
  .catch(console.error)
  .then((network: NetworkFacade) => { // initialize the commands
    const commands = [
      ListCommand,
      AccountCreateCommand,
      FindCommand,
      AccountLogoutCommand,
      AccountLoginCommand,
      RunCommand,
      CreateCommand,
      SetCommand,
      DeleteCommand,
      LogCommand,
      UpdateCommand,
    ];

    Commander.config();
    commands.forEach((Item) => {
      Commander.addCommand(new Item(network));
    });
    try {
      Commander.start();
    } catch (error) {
      console.error(`${error.message} \nFor other informations about the command type etherless -h`);
      network.disconnect();
    }

    process.on('exit', () => {
      if (network !== undefined) network.disconnect();
    });
  });
process.on('SIGINT', () => {
  process.exit();
});
