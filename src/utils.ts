const fs = require('fs');
const AdmZip = require('adm-zip');

class Utils {
  static randomString() : string {
    return Math.random().toString(36).substring(2, 15) + Math.random()
      .toString(36).substring(2, 15);
  }

  static compressFile(filePath: string) : string {
    const fileContent = fs.readFileSync(filePath);
    const zip = new AdmZip();
    zip.addFile('handler.js', fileContent);
    return zip.toBuffer();
  }
}

export default Utils;
