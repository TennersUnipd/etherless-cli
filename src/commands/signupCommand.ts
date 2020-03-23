import { Command } from './command';
import SessionManager from '../sessionManager';

class AccountCreateCommand extends Command {
    COMMAND_NAME = 'signup';

    COMMAND_ALIAS = 'su';

    COMMAND_DESCRIPTION = 'Create a new account';

    exec(): Promise<any> {
      const account = this.network.accountCreate();
      SessionManager.getInstance().login(account);
      return new Promise<any>((resolve) => {
        resolve(account);
      });
    }
}

export default AccountCreateCommand;
