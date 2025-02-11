import { Test, TestingModule } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../config';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: 'TASKS',
          useValue: [],
        },
        {
          provide: 'PG',
          useValue: {
            getTasksPG: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: config.KEY,
          useValue: {
            apiKey: 'test-api-key',
            database: { name: 'test-database' },
          } as ConfigType<typeof config>,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
