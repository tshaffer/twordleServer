import express from 'express';
import cors from 'cors';

const en = require('dictionary-en');

import * as fs from 'fs';

// import cookieParser from 'cookie-parser';
import { readConfig } from './config';

const bodyParser = require('body-parser');

import { Routes } from './routes/routes';

import {
  getTest,
  postTest,
} from './controllers';

class App {

  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {

    readConfig('/Users/tedshaffer/Documents/Projects/twordleServer/src/config/config.env');

    // https://www.npmjs.com/package/hunspell-spellchecker
    var Spellchecker = require("hunspell-spellchecker");
    var spellchecker = new Spellchecker();


    // Parse an hunspell dictionary that can be serialized as JSON
    var DICT = spellchecker.parse({
      aff: fs.readFileSync("/Users/tedshaffer/Documents/Projects/twordleServer/node_modules/dictionary-en/index.aff"),
      dic: fs.readFileSync("/Users/tedshaffer/Documents/Projects/twordleServer/node_modules/dictionary-en/index.dic")
    });

    // Load a dictionary
    spellchecker.use(DICT);

    // Check a word
    var isPizzaRight = spellchecker.check("pizza");
    var isFlibbetRight = spellchecker.check("flibbet");

    // en(function (err: any, result: any) {
    //   console.log(err || result);
    // });

    this.app = express();
    this.config();

    this.app.use(express.static(__dirname + '/public'));
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.route.routes(this.app);

    this.app.get('/api/v1/test', getTest);
    this.app.post('/api/v1/test', postTest);
  }

  private config(): void {
    let port: any = process.env.PORT;
    if (port === undefined || port === null || port === '') {
      port = 8888;
    }
    this.app.set('port', port);
  }
}

export default new App().app;
