import Utils from './utils';


export default class Logger {
  private logs: Log[];

  public static readonly location = 'logs.json';

  constructor() {
    this.load();
  }

  public addLog(log: Log): void {
    if (this.logs.unshift(log) > 20) {
      this.logs = this.logs.slice(0, 20);
    }
  }

  public save(): void {
    const jsonlogs = JSON.stringify(this.logs);
    Utils.localStorage.setItem(Logger.location, jsonlogs);
  }

  public getLogs(): JSON {
    return JSON.parse(JSON.stringify(this.logs));
  }

  private load(): void {
    this.logs = JSON.parse(Utils.localStorage.getItem(Logger.location));
    if (this.logs === null) this.logs = [];
  }
}

interface Log {
  logName: string;
  logDate: string;
  logCost: number;
}
