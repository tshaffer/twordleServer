import express from 'express';
import cors from 'cors';

// import cookieParser from 'cookie-parser';
import { readConfig } from './config';

import { initializeSpellChecker } from './controllers';

const bodyParser = require('body-parser');

import { Routes } from './routes/routes';

import {
  getTest,
  postTest,
  getVersion,
  getWords,
  getHelperWords,
} from './controllers';

class App {

  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {

    readConfig('/Users/tedshaffer/Documents/Projects/twordleServer/src/config/config.env');

    initializeSpellChecker();
    
    this.app = express();
    this.config();

    this.app.use(express.static(__dirname + '/public'));
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.route.routes(this.app);

    // app routes
    this.app.get('/api/v1/version', getVersion);
    
    this.app.post('/api/v1/getWords', getWords);
    this.app.post('/api/v1/getHelperWords', getHelperWords);

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
