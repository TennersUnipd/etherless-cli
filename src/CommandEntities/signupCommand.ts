// eslint-disable-next-line no-unused-vars
import { Command, CommandInputs } from './command';

class AccountCreateCommand extends Command {
    COMMAND_NAME = 'signup <password>';

    COMMAND_ALIAS = 'su';

    COMMAND_DESCRIPTION = 'Create a new account';

    exec(inputs: SignupCommandInputs): Promise<any> {
      return new Promise<string>((resolve) => {
        const success = this.network.signup(inputs.password);
        resolve(success ? 'Signed up successfully' : 'Unable to sign up');
      });
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): SignupCommandInputs {
      return { password: args[0] };
    }
}

interface SignupCommandInputs extends CommandInputs {
  password: string;
}

export default AccountCreateCommand;
