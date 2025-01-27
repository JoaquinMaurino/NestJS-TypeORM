import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Config for Pipes Validation => requests are required to follow dtos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })
  );

  //Swagger documentation config
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('NEST API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  //Enables access from all clients 
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
