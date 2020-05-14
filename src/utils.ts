/**
 * @file utils.ts
 * @class Utils
 */
import os from 'os';
import fs from 'fs';
import AdmZip from 'adm-zip';
import config from './config.json';

const LS = require('node-localstorage').LocalStorage;

/**
 * @class Utils is a collection a static method
 */
export default class Utils {
  /**
   * @function randomString()
   * @return a random sting
   */
  static randomString(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random()
      .toString(36).substring(2, 15);
  }

  /**
   *
   * @param filePath file path to include in the zip
   * @param remoteResource file name to assign in the zip
   */
  static compressFile(filePath: string, remoteResource: string): string {
    const fileContent = fs.readFileSync(filePath);
    const zip = new AdmZip();
    zip.addFile(`${remoteResource}.js`, fileContent);
    return zip.toBuffer();
  }

  /** contains the configuration config.json */
  static readonly config = config.personalStaging;

  /** contains the path to the configuration folder */
  static readonly userDir = os.homedir() + Utils.config.CONFIG_FOLDER;

  /** utility object to store file in the specified location */
  static readonly localStorage = new LS(Utils.userDir);
}
