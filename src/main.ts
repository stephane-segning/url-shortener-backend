import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mw } from 'request-ip';
import { express as em } from 'express-useragent';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap(port = process.env.PORT ?? 3000) {
  initializeTransactionalContext();

  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    logger,
  });

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

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

  app.use(compression());
  app.use(cookieParser());
  app.use(mw());
  app.use(em());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'https://cdn.jsdelivr.net'],
          styleSrc: [
            '\'self\'',
            '\'unsafe-inline\'',
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
          ],
          imgSrc: ['\'self\'', 'data:', 'https://cdn.jsdelivr.net'],
          connectSrc: ['\'self\'', 'https://cdn.jsdelivr.net'],
          fontSrc: [
            '\'self\'',
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
          ],
        },
      },
    }),
  );

  await app.listen(port);

  const urls = await Promise.all([app.getUrl(), `http://localhost:${port}`])

  logger.log(`>> Application is running on: ${await app.getUrl()}`);
  urls.forEach((url) => {
    logger.log(`>> Swagger is running on: ${url}/swagger`);
    logger.log(`>> GraphQL is running on: ${url}/graphql`);
  });
}

bootstrap();
