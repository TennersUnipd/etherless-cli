import commander from 'commander';
import { Command, ExecutionResponse } from './command';
import Logger from '../log';
import RunCommand from './runCommand';


class Commander {
  private static VERSION = '1.0';

  private static DESCRIPTION = 'Etherless CLI';

  /**
   * @function config()
   *  This static method is needed for initialization of the external library Commander
   */
  static config() {
    commander
      .version('0.0.1')
      .description('Etherless CLI');
  }

  /**
   * @function addCommand()
   * @param cmd
   * @function This static method adds to the external library Commander a new command.
   */
  static addCommand(cmd: Command) {
    commander
      .command(cmd.getCommandDescriptor())
      .alias(cmd.getCommandAlias())
      .description(cmd.getDescription())
      .option('--dev')
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
            console.error(error);
          })
          .finally(() => {
            cmd.disconnect();
          });
      });
  }

  static logActions(logData: object) {
    const logged = new Logger(logData);
  }

  /**
   * @function addCommand()
   * @param cmd
   * static method starts the execution of a function parsing the inputs from the command line.
   */
  static start() {
    commander.parse(process.argv);
  }
}

export default Commander;
