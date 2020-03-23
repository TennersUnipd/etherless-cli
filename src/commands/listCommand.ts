import { Command, CommandInputs } from './command';

class ListCommand extends Command {
    COMMAND_NAME = 'list';

    COMMAND_ALIAS = 'l';

    COMMAND_DESCRIPTION = 'List of all functions available on Etherless';

    exec(): Promise<any> {
      const contractFn = this.network.getContractMethods().listFunctions();
      return this.network.callContractMethod(contractFn)
        .then((results: string[]) => {
          if (results.length > 0) {
            return results.join('\n');
          }
          return 'No functions';
        });
    }
}

export default ListCommand;
