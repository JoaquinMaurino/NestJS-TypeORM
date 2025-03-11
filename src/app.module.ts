import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios'
import * as Joi from 'joi';
import { lastValueFrom } from 'rxjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from '../enviroments'
import { AuthModule } from './auth/auth.module';
import config from '../config'

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: enviroments[process.env.NODE_ENV as keyof typeof enviroments] || '.env',
    load: [config],
    isGlobal: true,
    validationSchema: Joi.object({
      API_KEY: Joi.string().required(),
      DATABASE: Joi.string().required(),
    })
  }), ProductsModule, UsersModule, HttpModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const request = http.get('https://jsonplaceholder.typicode.com/todos');
        const tasks = await lastValueFrom(request);
        return tasks.data;
      },
      inject: [HttpService]
    },
  ],
})
export class AppModule { }
