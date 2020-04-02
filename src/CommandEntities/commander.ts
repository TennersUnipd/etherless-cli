// eslint-disable-next-line no-unused-vars
import NetworkUtils from '../NetworkEntities/NetworkUtils';
import { Command } from './command';

const commander = require('commander');

class Commander {
    private static VERSION: string = '1.0';

    private static DESCRIPTION: string = 'Etherless CLI';

    static config() {
      commander
        .version('0.0.1')
        .description('Etherless CLI');
    }

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
              NetworkUtils.getEtherlessNetworkFacadeInstance().disconnect();
            });
        });
    }

    static start() {
      commander.parse(process.argv);
    }
}

export default Commander;
