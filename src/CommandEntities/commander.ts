import commander from 'commander';

import { Command } from './command';


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
          .then((result) => {
            console.log(result);
          }).catch((error) => {
            console.error(`${error.message} \nFor other information about the command type etherless -h`);
          })
          .finally(() => {
            cmd.disconnect();
          });
      });
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
