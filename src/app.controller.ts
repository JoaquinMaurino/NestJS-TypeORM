import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/jp-tasks')
  getTasks(): any[] {
    return this.appService.getTasksJSONPlaceholder()
  }

  @Get('data')
  envData() {
    return this.appService.getEnvData()
  }

  @Get('/pg-tasks')
  pgTasks() {
    return this.appService.getTasksPG()
  }
}
