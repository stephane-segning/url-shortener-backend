import { Oauth2ClientEntity } from './oauth2-client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';

@QueryService(Oauth2ClientEntity)
export class Oauth2ClientService extends TypeOrmQueryService<Oauth2ClientEntity> {
  constructor(
    @InjectRepository(Oauth2ClientEntity)
    private readonly repository: Repository<Oauth2ClientEntity>,
  ) {
    super(repository);
  }

  async findFirst(clientId: string, clientSecret: string) {
    const found = await this.repository.findOne({
      where: {
        clientId,
        clientSecret,
        disabled: false,
      },
    });

    if (!found) {
      return null;
    }

    return found;
  }

  public async createDefaultClient(clientId: string, clientSecret: string) {
    const found = await this.findFirst(clientId, clientSecret);

    if (found) {
      return;
    }

    const entity = this.repository.create({
      clientId,
      clientSecret,
      name: 'Default Client',
      description: 'Default client for the OAuth2 server',
      accessTokenLifetime: 3600, // 1 hour
      refreshTokenLifetime: 7200, // 2 hours
      redirectUris: ['http://localhost:3000'],
      grants: ['refresh_token', 'password'],
      scopes: ['openid', 'profile', 'email'],
    });

    await this.repository.save(entity);
  }
}
