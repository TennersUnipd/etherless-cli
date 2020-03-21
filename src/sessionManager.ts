import User from './user';

class SessionManager {
    private static instance: SessionManager;

    public user?: User;

    private constructor() {
      this.user = undefined;
    }

    public static getInstance(): SessionManager {
      if (!SessionManager.instance) {
        SessionManager.instance = new SessionManager();
      }

      return SessionManager.instance;
    }

    userLogged(): boolean {
      return this.user === undefined;
    }
}

export default SessionManager;
