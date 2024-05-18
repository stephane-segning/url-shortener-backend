import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { UsersCreateDto } from './users.create.dto';
import { UserEntity } from './user.entity';
import { UsersDto } from './users.dto';
import { OAuth2TokenEntity } from '@/auth/oauth2-token/oauth2-token.entity';
import { Oauth2ClientEntity } from '@/auth/oauth2-client/oauth2-client.entity';

@Module({
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          UserEntity,
          OAuth2TokenEntity,
          Oauth2ClientEntity,
        ]),
      ],
      services: [UsersService],
      resolvers: [
        {
          pagingStrategy: PagingStrategies.OFFSET,
          EntityClass: UserEntity,
          DTOClass: UsersDto,
          CreateDTOClass: UsersCreateDto,
          enableTotalCount: true,
          enableSubscriptions: true,
          Service: UsersService,
        },
      ],
    }),
  ],
})
export class UsersModule {}
