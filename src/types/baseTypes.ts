export interface TwordleConfiguration {
  PORT: number;
}

// wordsFoundBySpecifiedLetterCount
export interface WordsFoundByNumberOfSpecifiedLetters {
  [letterCount: string]: string[]; // wordsFound
}

