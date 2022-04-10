import { Request, Response } from 'express';
const en = require('dictionary-en');
import * as fs from 'fs';
import { isNil } from 'lodash';

import { version } from '../version';

import { WordsFoundByNumberOfSpecifiedLetters } from '../types';

let spellchecker: { parse: (arg0: { aff: Buffer; dic: Buffer; }) => any; use: (arg0: any) => void; check: (arg0: string) => any; };

export const initializeSpellChecker = () => {

  // https://www.npmjs.com/package/hunspell-spellchecker
  const Spellchecker = require('hunspell-spellchecker');
  spellchecker = new Spellchecker();

  // Parse an hunspell dictionary that can be serialized as JSON
  const DICT = spellchecker.parse({
    aff: fs.readFileSync('./node_modules/dictionary-en/index.aff'),
    dic: fs.readFileSync('./node_modules/dictionary-en/index.dic')
  });

  // Load a dictionary
  spellchecker.use(DICT);

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

  const { candidateLettersAtLocation, lettersSomewhereInWord } = request.body;

  const words: string[] = [];

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

            const candidateWord: string = clal0 + clal1 + clal2 + clal3 + clal4;

            // console.log(candidateWord + candidateWord.length);

            // ensure that word contains all lettersNotAtExactLocation
            let allLettersSomewhereInWordAreInThisWord = true;
            const candidateWordAsArray = candidateWord.split('');
            for (const letterSomewhereInWord of lettersSomewhereInWord) {
              if (!isNil(letterSomewhereInWord)) {
                if (candidateWordAsArray.indexOf(letterSomewhereInWord) < 0) {
                  allLettersSomewhereInWordAreInThisWord = false;
                  break;
                }
              }
            }

            if (allLettersSomewhereInWordAreInThisWord) {
              const isWord = spellchecker.check(candidateWord);
              // console.log(candidateWord + ' ' + isWord);
              if (isWord) {
                words.push(candidateWord);
              }
            }
          }
        }
      }
    }
  }

  response.status(200).json({
    success: true,
    words,
  });
};

export const getNumberOfLettersInWordAtAnyLocationInFoundWord = (lettersInWordAtAnyLocationAsArray: string[], foundWord: string): number => {
  
  let lettersInWordAtAnyLocationInWordCount = 0;

  for (const letterInWord of lettersInWordAtAnyLocationAsArray) {
    if (foundWord.includes(letterInWord)) {
      lettersInWordAtAnyLocationInWordCount++;
    }
  }
  return lettersInWordAtAnyLocationInWordCount;
};


export const candidateWordIncludesLetterInWordAtAnyLocation = (lettersInWordAtAnyLocationAsArray: string[], candidateWord: string): boolean => {
  for (const letterInWordAtAnyLocation of lettersInWordAtAnyLocationAsArray) {
    if (candidateWord.includes(letterInWordAtAnyLocation)) {
      return true;
    }
  }
  return false;
};

export const candidateWordIncludesDuplicateLetterInWordAtAnyLocation = (lettersInWordAtAnyLocationAsArray: string[], candidateWord: string): boolean => {
  for (const letterInWordAtAnyLocation of lettersInWordAtAnyLocationAsArray) {
    const firstIndex = candidateWord.indexOf(letterInWordAtAnyLocation);
    const lastIndex = candidateWord.lastIndexOf(letterInWordAtAnyLocation);
    const result = firstIndex !== lastIndex && firstIndex !== -1;
    if (result) {
      return true;
    }
  }
  return false;
};

export const getHelperWords = (request: Request, response: Response, next: any) => {
  console.log('getHelperWords');
  console.log(request.body);

  const candidateWords: string[] = [];

  const { lettersInWordAtAnyLocation, commonLetters } = request.body;

  const lettersInWordAtAnyLocationAsArray: string[] = lettersInWordAtAnyLocation.split('');
  const candidateLetters: string[] = lettersInWordAtAnyLocationAsArray.concat(commonLetters);

  for (let clalIndex0 = 0; clalIndex0 < candidateLetters.length; clalIndex0++) {
    const clal0 = candidateLetters[clalIndex0];
    for (let clalIndex1 = 0; clalIndex1 < candidateLetters.length; clalIndex1++) {
      const clal1 = candidateLetters[clalIndex1];
      for (let clalIndex2 = 0; clalIndex2 < candidateLetters.length; clalIndex2++) {
        const clal2 = candidateLetters[clalIndex2];
        for (let clalIndex3 = 0; clalIndex3 < candidateLetters.length; clalIndex3++) {
          const clal3 = candidateLetters[clalIndex3];
          for (let clalIndex4 = 0; clalIndex4 < candidateLetters.length; clalIndex4++) {
            const clal4 = candidateLetters[clalIndex4];

            const candidateWord: string = clal0 + clal1 + clal2 + clal3 + clal4;

            if (candidateWordIncludesLetterInWordAtAnyLocation(lettersInWordAtAnyLocationAsArray, candidateWord)) {
              if (!candidateWordIncludesDuplicateLetterInWordAtAnyLocation(lettersInWordAtAnyLocationAsArray, candidateWord)) {
                candidateWords.push(candidateWord);
              }
            }
          }
        }
      }
    }
  }

  const words: string[] = [];
  const wordsFoundByNumberOfSpecifiedLetters: WordsFoundByNumberOfSpecifiedLetters = {};

  for (const candidateWord of candidateWords) {
    const isWord = spellchecker.check(candidateWord);
    if (isWord) {
      words.push(candidateWord);

      const numberOfLettersInWordAtAnyLocationInFoundWord = getNumberOfLettersInWordAtAnyLocationInFoundWord(lettersInWordAtAnyLocationAsArray, candidateWord);
      const key = numberOfLettersInWordAtAnyLocationInFoundWord.toString();
      if (isNil(wordsFoundByNumberOfSpecifiedLetters[key])) {
        wordsFoundByNumberOfSpecifiedLetters[key] = [];        
      }
      wordsFoundByNumberOfSpecifiedLetters[key].push(candidateWord);
    }
  }

  console.log('words length', words.length);
  console.log('wordsFoundByNumberOfSpecifiedLetters');

  let maxNumLettersFound = 0;
  for (const [key, value] of Object.entries(wordsFoundByNumberOfSpecifiedLetters)) {
    console.log(`${key}: ${value}`);
    const keyAsNum = parseInt(key, 10);
    if (keyAsNum > maxNumLettersFound) {
      maxNumLettersFound = keyAsNum;
    }
  }

  console.log('maxNumLettersFound', maxNumLettersFound);
  const matchesWithMaxLettersFound: string[] = wordsFoundByNumberOfSpecifiedLetters[maxNumLettersFound.toString()];
  console.log(matchesWithMaxLettersFound);

  response.status(200).json({
    success: true,
    // words,
    // wordsFoundByNumberOfSpecifiedLetters,
    helperWord: matchesWithMaxLettersFound[0],
  });
};
