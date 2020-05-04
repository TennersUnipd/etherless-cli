// eslint-disable-next-line no-unused-vars
import { Command, CommandInputs } from './command';

class AccountLoginCommand extends Command {
  COMMAND_NAME = 'login <privateKey> <password>';

  COMMAND_ALIAS = 'lg';

  COMMAND_DESCRIPTION = 'Log in with an ethereum account';

  exec(inputs: LoginInputs): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.network.logon(inputs.privateKey, inputs.password);
        resolve('Logged in successfully');
      } catch (Error) {
        reject(Error.message);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): LoginInputs {
    if (args.length === 2) {
      if (args[0].length === 66) {
        return { privateKey: args[0], password: args[1] };
      }
      throw new Error('Private key must have 66 characters long: check the presence of the prefix 0x');
    }
    throw new Error('Invalid number of parameters');
  }
}

interface LoginInputs extends CommandInputs {
  privateKey: string;
  password: string;
}

export default AccountLoginCommand;
