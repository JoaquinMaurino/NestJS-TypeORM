import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import config from '../config'

@Injectable()
export class AppService {
  constructor(
    @Inject('TASKS') private tasksJp: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  //Data taks from api jsonplaceholder
  getTasksJSONPlaceholder() {
    return this.tasksJp
  }

  //Returns data from current envirionment 
  getEnvData() {
    const apiKey = this.configService.apiKey;
    const database = this.configService.database.name;
    return `API KEY for this enviroment is ${apiKey} - Database: ${database}`
  }
}
