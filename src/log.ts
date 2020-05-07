import Utils from './utils';

type Log = object;


export default class Logger {
  private static logs: Log[];

  private static location = 'logs.json';

  public static addLog(log: Log): void {
    Logger.logs = Logger.load();
    if (Logger.logs.unshift(log) > 20) {
      Logger.logs = Logger.logs.slice(0, 20);
    }
    Utils.localStorage.setItem(Logger.location, JSON.stringify(Logger.logs));
  }

  public static getLogs(): Log {
    return Logger.load();
  }

  public static load(): Log[] {
    Logger.logs = JSON.parse(Utils.localStorage.getItem(Logger.location));
    if (Logger.logs === null) Logger.logs = [];
    return Logger.logs;
  }
}
