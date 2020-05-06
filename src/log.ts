import Utils from './utils';

type Log = object;


export default class Logger {
  private static logs: Log[];

  private static location = 'logs.json';

  public static addLog(log: Log): void {
    if (this.logs.unshift(log) > 20) {
      this.logs = this.logs.slice(0, 20);
    }
    Utils.localStorage.setItem(Logger.location, JSON.stringify(this.logs));
  }

  public static getLogs(): Log {
    return this.load();
  }

  public static load(): Log[] {
    this.logs = JSON.parse(Utils.localStorage.getItem(Logger.location));
    if (this.logs === null) this.logs = [];
    return Logger.logs;
  }
}
