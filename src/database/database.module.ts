import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';

import config from '../../config'

@Global()
@Module({
    providers: [
        {
            provide: 'PG',
            useFactory: (configService: ConfigType<typeof config>) => {
                const { user, host, password, port, dbName } = configService.postgres
                const client = new Client({
                    database: dbName,
                    user,
                    host,
                    password,
                    port,
                });
                client.connect();
                return client
            },
            inject: [config.KEY]
        }
    ],
    exports: ['PG']
})
export class DatabaseModule { }
