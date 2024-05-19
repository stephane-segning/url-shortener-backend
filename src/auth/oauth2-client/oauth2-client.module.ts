import { Module, OnModuleInit } from '@nestjs/common';
import { Oauth2ClientService } from './oauth2-client.service';
import { Oauth2ClientEntity } from './oauth2-client.entity';
import { ConfigService } from '@nestjs/config';
import { NestjsQueryGraphQLModule, PagingStrategies } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Oauth2ClientDto } from '@/auth/oauth2-client/oauth2-client.dto';
import { Oauth2ClientCreateDto } from '@/auth/oauth2-client/oauth2-client.create.dto';

@Module({
  providers: [Oauth2ClientService],
  imports: [NestjsQueryGraphQLModule.forFeature({
    imports: [NestjsQueryTypeOrmModule.forFeature([Oauth2ClientEntity])],
    services: [Oauth2ClientService],
    resolvers: [
      {
        pagingStrategy: PagingStrategies.OFFSET,
        EntityClass: Oauth2ClientEntity,
        DTOClass: Oauth2ClientDto,
        CreateDTOClass: Oauth2ClientCreateDto,
        enableTotalCount: true,
        enableSubscriptions: true,
        Service: Oauth2ClientService,
      },
    ],
  })],
  exports: [Oauth2ClientService],
})
export class Oauth2ClientModule implements OnModuleInit {
  constructor(
    private readonly oauth2ClientService: Oauth2ClientService,
    private readonly configService: ConfigService,
  ) {
  }

  async onModuleInit() {
    const clientId = this.configService.get<string>('oauth2.defaultClient.id');
    const clientSecret = this.configService.get<string>(
      'oauth2.defaultClient.secret',
    );
    await this.oauth2ClientService.createDefaultClient(clientId, clientSecret);
  }
}
