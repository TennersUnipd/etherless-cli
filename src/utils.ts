require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

export class Utils {
  static randomIdentifier() : string {
    return Math.random().toString(36).substring(2, 15) + Math.random()
      .toString(36).substring(2, 15);
  }
}

export default Utils;
