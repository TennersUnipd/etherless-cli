import { Command } from './command';

const commander = require('commander');

class Commander {
  private static VERSION = '1.0';

  private static DESCRIPTION = 'Etherless CLI';

  /**
     * @method config()
     * @brief This static method is needed for initialization of the external library Commander
     */
  static config() {
    commander
      .version('0.0.1')
      .description('Etherless CLI');
  }

  /**
     * @method addCommand()
     * @param cmd
     * @method This static method adds to the external library Commander a new command.
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
          .then((result) => {
            console.log(result);
          }).catch((error) => {
            console.error(error);
          })
          .finally(() => {
            cmd.disconnect();
          });
      });
  }

  /**
     * @method addCommand()
     * @param cmd
     * @method This static method starts the execution of a function parsing the inputs from the command line.
     */
  static start() {
    commander.parse(process.argv);
  }
}

export default Commander;
