import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg'

import config from '../config'

@Injectable()
export class AppService {
  constructor(
    @Inject('TASKS') private tasksJp: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('PG') private clientPg: Client
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

// Implementing Promise()
/*   getTasksPG() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });

    });
  } */

  //Implementing Async Try Catch
  async getTasksPG() {
    try {
      const tasks = await this.clientPg.query('SELECT * FROM tasks')
      return tasks.rows
    } catch (error) {
      console.log('Error fetching tasks from postgres client, error: ', error);
      throw new Error('Could not fetch tasks from postgres client')
    }
  }
}
