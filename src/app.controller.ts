import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //Test route to fetch jsonplacehoolder api
  @Get('/jp-tasks')
  getTasks(): any[] {
    return this.appService.getTasksJSONPlaceholder();
  }

  @Get('data')
  envData() {
    return this.appService.getEnvData();
  }

}
