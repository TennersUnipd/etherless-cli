import DOTENV from 'dotenv-flow';
import os from 'os';
import fs from 'fs';
import AdmZip from 'adm-zip';
import config from './config.json';

const LS = require('node-localstorage').LocalStorage;

DOTENV.config();

export default class Utils {
  static randomString(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random()
      .toString(36).substring(2, 15);
  }

  static compressFile(filePath: string, remoteResource: string): string {
    const fileContent = fs.readFileSync(filePath);
    const zip = new AdmZip();
    zip.addFile(`${remoteResource}.js`, fileContent);
    return zip.toBuffer();
  }

  static print(content?: any) {
    console.log(content);
  }

  static readonly config = config;

  static readonly userDir = os.homedir() + Utils.config.CONFIG_FOLDER;

  static readonly localStorage = new LS(Utils.userDir);
}
