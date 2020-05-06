import commander from 'commander';
import { Command, ExecutionResponse } from './command';
import Logger from '../log';


class Commander {
  private static VERSION = '1.0';

  private static DESCRIPTION = 'Etherless CLI';

  /**
   * @function config()
   *  This static method is needed for initialization of the external library Commander
   */
  static config(): void {
    commander
      .name('etherless')
      .version('0.0.1')
      .description('Etherless CLI');
  }

  /**
   * @function addCommand()
   * @param cmd
   * @function This static method adds to the external library Commander a new command.
   */
  static addCommand(cmd: Command): void {
    commander
      .command(cmd.getCommandDescriptor())
      .alias(cmd.getCommandAlias())
      .description(cmd.getDescription())
      .action(() => {
        const inputs = cmd.parseArgs(commander.args);
        cmd.exec(inputs)
          .then((result: ExecutionResponse | string) => {
            let response;
            if (typeof result !== 'string') {
              response = result.response;
              if (result.logData) {
                Commander.logActions(result.logData);
              }
            } else {
              response = result;
            }
            console.log(response);
          }).catch((error) => {
            console.error(`${error.message} \nFor other information about the command type etherless -h`);
          })
          .finally(() => {
            cmd.disconnect();
          });
      });
  }

  static logActions(logData: object): void {
    Logger.addLog(logData);
  }

  /**
   * @function addCommand()
   * @param commands
   * @param cmd
   * static method starts the execution of a function parsing the inputs from the command line.
   */
  static start() {
    commander.on('command:*', (operands) => {
      const availableCommands = commander.commands.map((cmd) => cmd.name());
      const filt = availableCommands.filter((command: string) => command === operands[0]);
      if (filt.length === 0) throw new Error(`${operands[0]} command not found`);
    });
    commander.parse(process.argv);
  }
}

export default Commander;
