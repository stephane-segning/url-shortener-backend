import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mw } from 'request-ip';
import { express as em } from 'express-useragent';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger } from '@nestjs/common';

async function bootstrap(port = process.env.PORT ?? 3000) {
  initializeTransactionalContext();

  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    logger,
  });

  const config = new DocumentBuilder()
    .setTitle('Url shortener')
    .setDescription('The url shortener API description')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.enable('trust proxy');
  app.disable('x-powered-by');

  app.use(mw());
  app.use(em());

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger is running on: ${await app.getUrl()}/swagger`);
  logger.log(`GraphQL is running on: ${await app.getUrl()}/graphql`);
}

bootstrap();
