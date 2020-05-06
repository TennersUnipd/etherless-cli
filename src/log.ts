const fs = require('fs');
type Log = object;


export default class Logger {
  private logs: Log[];

  constructor(log: Log) {
    this.loadJSON();
    this.addLog(log);
    this.saveOnJSON();
  }

  private addLog(log: Log) {
    if (this.logs.unshift(log) > 20) {
      this.logs = this.logs.slice(0, 20);
    }
  }

  private saveOnJSON() {
    const jsonlogs = JSON.stringify(this.logs);
    fs.writeFile('logs.json', jsonlogs, (error) => {
      if (error) console.log(error);
    });
  }

  private loadJSON() {
    try {
      this.logs = JSON.parse(fs.readFileSync('logs.json', 'utf-8'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.logs = [];
      } else {
        throw err;
      }
    }
  }
}
