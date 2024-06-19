import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DefaultdataService } from './defaultdata/defaultdata.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
 const defaultDataService = app.get(DefaultdataService);

  await defaultDataService.initializeDefaultData();
  const config = new DocumentBuilder()
    .setTitle('Order Management System')
    .setDescription('The order management API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
