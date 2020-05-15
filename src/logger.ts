import Utils from './utils';

type Log = object;

/**
 * @class Logger
 * This class is used to read and write the log file
 */
export default class Logger {
  private static logs: Log[];

  private static location = 'logs.json';

  /**
   * adds log to the list
   * @param log a log object
   */
  public static addLog(log: Log): void {
    Logger.logs = Logger.load();
    if (Logger.logs.unshift(log) > 20) {
      Logger.logs = Logger.logs.slice(0, 20);
    }
    Utils.localStorage.setItem(Logger.location, JSON.stringify(Logger.logs));
  }

  /**
   * @returns the log[] loaded from the user folder
   */
  public static getLogs(): Log[] {
    return Logger.load();
  }

  /**
   * loads the log from the local file.
   */
  public static load(): Log[] {
    Logger.logs = JSON.parse(Utils.localStorage.getItem(Logger.location));
    if (Logger.logs === null) Logger.logs = [];
    return Logger.logs;
  }
}
