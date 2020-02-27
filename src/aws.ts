var AWS = require('aws-sdk');
var fs = require('fs');
var AdmZip = require('adm-zip');

AWS.config.loadFromPath('./aws-credentials.json');
var lambda = new AWS.Lambda({ region: 'us-east-1' });

const ARN_ROLE = "arn:aws:iam::964189167587:role/etherless-dev";
const FN_RUNTIME = "nodejs12.x";
const FN_TIMEOUT = 30;

export function createFunction(fnName: string, filePath: string) {

    // TODO: create function that only zips
    let fileContent = fs.readFileSync(filePath);
    var zip = new AdmZip();
    zip.addFile(fnName + ".js", fileContent);
    let compressed = zip.toBuffer();


    var params = {
        Code: {
            ZipFile: compressed
        },
        Description: "",
        FunctionName: fnName,
        Handler: fnName + ".handler",
        MemorySize: 128,
        Publish: true,
        Role: ARN_ROLE,
        Runtime: FN_RUNTIME,
        Timeout: FN_TIMEOUT,
        VpcConfig: {
        }
    };
    let prom = new Promise(function (resolve, reject) {
        lambda.createFunction(params, function (err: any, data: any) {
            if (err) reject(err);
            else resolve(data);
        });
    })
    return prom;
}