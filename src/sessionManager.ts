import { Account } from 'web3-core';
import Utils from './utils';
import Network from './network';

class SessionManager {
    private static readonly ACCOUNT_KEY = 'account';

    private static instance: SessionManager;

    public user?: Account;

    private constructor() {
      const stored = Utils.localStorage.getItem(SessionManager.ACCOUNT_KEY);
      if (stored !== null && stored !== undefined) {
        const parsedAccountData = JSON.parse(stored);
        const account = Network.getInstance().ethPrivateKeyToAccount(parsedAccountData.privateKey);
        this.user = account;
      }
    }

    public static getInstance(): SessionManager {
      if (!SessionManager.instance) {
        SessionManager.instance = new SessionManager();
      }

      return SessionManager.instance;
    }

    login(account: Account) {
      this.user = account;
      Utils.localStorage.setItem(SessionManager.ACCOUNT_KEY, JSON.stringify(account));
    }

    logout() {
      this.user = undefined;
      Utils.localStorage.removeItem(SessionManager.ACCOUNT_KEY);
    }

    userLogged(): boolean {
      return this.user !== undefined;
    }
}

export default SessionManager;
