import { Command } from './command';

class ListCommand extends Command {
    COMMAND_NAME = 'list';

    COMMAND_ALIAS = 'l';

    COMMAND_DESCRIPTION = 'List of all functions available on Etherless';

    exec(): Promise<any> {
      return this.network.getAllLoadedFunction().then((commands) => commands.join('\n'));
    }
}

export default ListCommand;
