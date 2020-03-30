import { Command, CommandInputs } from './command';
import SessionManager from '../sessionManager';

class AccountLoginCommand extends Command {
    COMMAND_NAME = 'login <privateKey>';

    COMMAND_ALIAS = 'lg';

    COMMAND_DESCRIPTION = 'Log in with an ethereum account';

    exec(inputs: LoginInputs): Promise<any> {
      const account = this.network.ethPrivateKeyToAccount(inputs.privateKey);
      SessionManager.getInstance().login(account);
      return new Promise<any>((resolve, reject) => {
        if (account !== undefined) {
          resolve(account);
        } else {
          reject(new Error('No account found for given private key'));
        }
      });
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): LoginInputs {
      return { privateKey: args[0] };
    }
}

interface LoginInputs extends CommandInputs {
    privateKey: string;
}

export default AccountLoginCommand;
