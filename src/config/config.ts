import * as dotenv from 'dotenv';
import { isNil } from 'lodash';
import { TedClientServerBoilerplateConfiguration } from '../types';

export let tedClientServerBoilerplateConfiguration: TedClientServerBoilerplateConfiguration; 

export const readConfig = (pathToConfigFile: string): void => {

  try {
    const configOutput: dotenv.DotenvConfigOutput = dotenv.config({ path: pathToConfigFile });
    const parsedConfig: dotenv.DotenvParseOutput | undefined = configOutput.parsed;

    if (!isNil(parsedConfig)) {
      tedClientServerBoilerplateConfiguration = {
        MONGO_URI: parsedConfig.MONGO_URI,
        PORT: Number(parsedConfig.PORT),
      };
      console.log(tedClientServerBoilerplateConfiguration);
    }
  }
  catch (err) {
    console.log('Dotenv config error: ' + err.message);
  }
};
