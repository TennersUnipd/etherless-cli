import { Command } from './command';
import SessionManager from '../sessionManager';

class AccountLogoutCommand extends Command {
    COMMAND_NAME = 'logout';

    COMMAND_ALIAS = 'lo';

    COMMAND_DESCRIPTION = 'Logout from your account';

    // eslint-disable-next-line class-methods-use-this
    exec(): Promise<any> {
      SessionManager.getInstance().logout();
      return new Promise<any>((resolve) => {
        resolve('Logged out');
      });
    }
}

export default AccountLogoutCommand;
