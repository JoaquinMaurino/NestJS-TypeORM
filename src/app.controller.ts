import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { Public } from './auth/decorators/public.decorator';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
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
