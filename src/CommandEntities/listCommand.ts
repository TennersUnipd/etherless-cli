import { Command } from './command';

class ListCommand extends Command {
  COMMAND_NAME = 'list';

  COMMAND_ALIAS = 'l';

  COMMAND_DESCRIPTION = 'List of all functions available on Etherless';

  exec(): Promise<any> {
    return this.network.getAllLoadedFunction().then((commands) => {
      const header = ['NAME\t\tCOST\t\tPROTOTYPE\t\tDESCRIPTION'];
      const commandsRows = commands.map((command) => `${command.name}\t\t${command.cost}\t\t${command.prototype}\t\t\t${command.description}`);
      return header.concat(commandsRows).join('\n');
    });
  }
}

export default ListCommand;
