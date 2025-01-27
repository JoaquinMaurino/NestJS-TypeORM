import { Module, Global } from '@nestjs/common';

const API_KEY_DEV = 'DEV123456'
const API_KEY_PROD = 'PROD123456'

@Global()
@Module({
    providers: [
        {
            provide: 'API_KEY_DEV',
            useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY_DEV,
        },
    ],
    exports: ['API_KEY_DEV']
})
export class DatabaseModule { }
