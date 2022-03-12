import { Request, Response } from 'express';

import { version } from '../version';

export const getVersion = (request: Request, response: Response, next: any) => {
  console.log('getVersion');
  const data: any = {
    serverVersion: version,
  };
  response.json(data);
};

export const getWords = (request: Request, response: Response, next: any) => {
  console.log('getWords');
  response.status(200).json({
    success: true,
    words: ['herro', 'pizza'],
  });
};
