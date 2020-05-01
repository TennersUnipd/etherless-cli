// eslint-disable-next-line no-unused-vars
import { Command, CommandInputs } from './command';

class AccountLoginCommand extends Command {
  COMMAND_NAME = 'login <privateKey> <password>';

  COMMAND_ALIAS = 'lg';

  COMMAND_DESCRIPTION = 'Log in with an ethereum account';

  exec(inputs: LoginInputs): Promise<string> {
    return new Promise<string>((resolve) => {
      const success = this.network.logon(inputs.privateKey, inputs.password);
      resolve(success ? 'Logged in successfully' : 'Unable to login');
    });
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): LoginInputs {
    return { privateKey: args[0], password: args[1] };
  }
}

interface LoginInputs extends CommandInputs {
  privateKey: string;
  password: string;
}

export default AccountLoginCommand;
