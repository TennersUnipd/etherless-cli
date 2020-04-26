import { Command } from './command';

class LogCommand extends Command {
    COMMAND_NAME = 'log';

    COMMAND_ALIAS = 'll';

    COMMAND_DESCRIPTION = 'Log of all transactions of the account logged in';

    exec(): Promise<any> {
        return this.network.getListOfTransaction().then((command) => {
            console.log(command);
          });
    }
}

export default LogCommand;
