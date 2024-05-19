import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedirectModule } from './redirect/redirect.module';
import { UsersModule } from './users/users.module';
import { CodesModule } from './codes/codes.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AuthGuard } from '@/auth/auth.guard';
import { MetricsModule } from './metrics/metrics.module';
import oauth2 from '@/shared/oauth2';
import * as process from 'node:process';
import * as path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [oauth2],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        await import(path.join(process.cwd(), 'ormconfig.json')),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }) => ({ req }),
    }),
    HealthModule,
    RedirectModule,
    UsersModule,
    CodesModule,
    AuthModule,
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
