import DOTENV from 'dotenv-flow';
import { Command, CommandInputs } from './command';
import SessionManager from '../sessionManager';
import Network from '../network';
import Utils from '../utils';

class TestCommand extends Command {
    COMMAND_NAME = 'test';

    COMMAND_ALIAS = 't';

    COMMAND_DESCRIPTION = 'Dev test command';

    // eslint-disable-next-line class-methods-use-this
    exec(): Promise<any> {
      let envConfig = {};
      if (process.argv.indexOf('--dev') > -1) {
        envConfig = { node_env: 'development' };
      }
      DOTENV.config(envConfig);
      Network.updateAbi(process.env.CONTRACT_ADDRESS ?? '', process.env.ABI_PATH ?? '');
      // return this.network.transactContractMethod(this.network.getContractMethods().createFunction(Utils.randomString()));
      return new Promise<boolean>((resolve) => {
        resolve(SessionManager.getInstance().userLogged());
      });
    }
}

export default TestCommand;
