import { Module } from '@nestjs/common';
import { RedirectModule } from './redirect/redirect.module';
import { UsersModule } from './users/users.module';
import { CodesModule } from './codes/codes.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: 'gettingstarted.db',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entityPrefix: 'urs_',
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    RedirectModule,
    UsersModule,
    CodesModule,
    AuthModule,
  ],
})
export class AppModule {}
