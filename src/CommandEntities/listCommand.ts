/**
 * @file listCommand.ts
 * @class ListCommand
 * @package CommandEntities
 */
import { Command } from './command';

/**
 * @class
 * @extends Command
 * Implements the list command
 */
class ListCommand extends Command {
  COMMAND_NAME = 'list';

  COMMAND_ALIAS = 'l';

  COMMAND_DESCRIPTION = 'List of all functions available on Etherless';

  exec(): Promise<string> {
    return this.network.getAllLoadedFunction().then((commands) => {
      const header = ['NAME\t\tCOST\t\tPROTOTYPE\t\tDESCRIPTION'];
      const commandsRows = commands.map((command) => `${command.name}\t\t${command.cost}\t\t${command.prototype}\t\t\t${command.description}`);
      return header.concat(commandsRows).join('\n');
    });
  }
}

export default ListCommand;
