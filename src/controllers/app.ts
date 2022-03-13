import { Request, Response } from 'express';
const en = require('dictionary-en');
import * as fs from 'fs';

import { version } from '../version';

let spellchecker: { parse: (arg0: { aff: Buffer; dic: Buffer; }) => any; use: (arg0: any) => void; check: (arg0: string) => any; };

export const initializeSpellChecker = () => {

  // https://www.npmjs.com/package/hunspell-spellchecker
  const Spellchecker = require('hunspell-spellchecker');
  spellchecker = new Spellchecker();

  // Parse an hunspell dictionary that can be serialized as JSON
  const DICT = spellchecker.parse({
    aff: fs.readFileSync('/Users/tedshaffer/Documents/Projects/twordleServer/node_modules/dictionary-en/index.aff'),
    dic: fs.readFileSync('/Users/tedshaffer/Documents/Projects/twordleServer/node_modules/dictionary-en/index.dic')
  });

  // Load a dictionary
  spellchecker.use(DICT);

  // Check a word
  const isPizzaRight = spellchecker.check('pizza');
  const isFlibbetRight = spellchecker.check('flibbet');

  console.log('isPizzaRight: ' + isPizzaRight);
  console.log('isFlibbetRight: ' + isFlibbetRight);

  // en(function (err: any, result: any) {
  //   console.log(err || result);
  // });
};


export const getVersion = (request: Request, response: Response, next: any) => {
  console.log('getVersion');
  const data: any = {
    serverVersion: version,
  };
  response.json(data);
};

export const getWords = (request: Request, response: Response, next: any) => {
  console.log('getWords');
  console.log(request.body);

  const { candidateLettersAtLocation, lettersNotAtExactLocation } = request.body;

  // for (let letterIndex = 0; letterIndex < 5; letterIndex++) {
    for (let clalIndex0 = 0; clalIndex0 < candidateLettersAtLocation[0].length; clalIndex0++) {
      const clal0 = candidateLettersAtLocation[0][clalIndex0];
      for (let clalIndex1 = 0; clalIndex1 < candidateLettersAtLocation[1].length; clalIndex1++) {
        const clal1 = candidateLettersAtLocation[1][clalIndex1];
        for (let clalIndex2 = 0; clalIndex2 < candidateLettersAtLocation[2].length; clalIndex2++) {
          const clal2 = candidateLettersAtLocation[2][clalIndex2];
          for (let clalIndex3 = 0; clalIndex3 < candidateLettersAtLocation[3].length; clalIndex3++) {
            const clal3 = candidateLettersAtLocation[3][clalIndex3];
            for (let clalIndex4 = 0; clalIndex4 < candidateLettersAtLocation[4].length; clalIndex4++) {
              const clal4 = candidateLettersAtLocation[4][clalIndex4];
              
              // check word
              const candidateWord = clal0 + clal1 + clal2 + clal3 + clal4;
              const isWord = spellchecker.check(candidateWord);
              console.log(candidateWord + ' ' + isWord);
            }
          }
        }
      }
    }
  // }

  response.status(200).json({
    success: true,
    words: ['herro', 'pizza'],
  });
};
