import { Command } from './command';

class AccountLogoutCommand extends Command {
  COMMAND_NAME = 'logout';

  COMMAND_ALIAS = 'lo';

  COMMAND_DESCRIPTION = 'Logout from your account';

  // eslint-disable-next-line class-methods-use-this
  exec(): Promise<any> {
    this.network.logout();
    return new Promise<any>((resolve) => {
      resolve('Logged out');
    });
  }
}

export default AccountLogoutCommand;
