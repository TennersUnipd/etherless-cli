var fs = require('fs');

export default class Logger{
    private logs: Log[];
    constructor(log: Log){
        this.loadJSON();
        this.addLog(log);
        this.saveOnJSON();
        console.log(this.logs);
    }
    private addLog(log: Log){
        if(this.logs.unshift(log) > 20 ){ // dubbio
            this.logs.pop();
        };
    }
    private saveOnJSON(){
        const jsonlogs = JSON.stringify(this.logs);
        fs.writeFile('logs.json', jsonlogs, (error) => {
            if(error) console.log(error);
        });
    }
    private loadJSON(){    
        try{
            this.logs = JSON.parse(fs.readFileSync('logs.json', 'utf-8'));
        }
        catch(err){
            if(err.code === 'ENOENT') {
                this.logs = new Array();
            } else {
                throw err;
            }
        }
    }
}

interface Log{
    fname: string;
    fdate: string;
    fcost: Number;
}