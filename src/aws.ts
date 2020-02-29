const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');

export default function createFunction(fnName: string, filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const zip = new AdmZip();
  zip.addFile(`${fnName}.js`, fileContent);
  const compressed = zip.toBuffer();

  return axios.post('https://sbx2aeqyl9.execute-api.us-east-1.amazonaws.com/dev/createFunction',
    {
      zip: compressed,
      name: fnName,
    })
    .then((response: any) => {
      console.log(response);
    })
    .catch(console.log);
}
