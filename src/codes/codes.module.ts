import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesResolver } from './codes.resolver';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { CodesEntity } from './codes.entity';
import { CodesDto } from './codes.dto';
import { CodesCreateDto } from './codes.create.dto';

@Module({
  providers: [CodesResolver, CodesService],
  exports: [CodesService],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([CodesEntity])],
      services: [CodesService],
      resolvers: [
        {
          pagingStrategy: PagingStrategies.OFFSET,
          EntityClass: CodesEntity,
          DTOClass: CodesDto,
          CreateDTOClass: CodesCreateDto,
          enableTotalCount: true,
          enableSubscriptions: true,
          Service: CodesService,
        },
      ],
    }),
  ],
})
export class CodesModule {}
