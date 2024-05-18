import { Injectable } from '@nestjs/common';
import { Oauth2ClientEntity } from './oauth2-client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class Oauth2ClientService {
  constructor(
    @InjectRepository(Oauth2ClientEntity)
    private readonly repository: Repository<Oauth2ClientEntity>,
  ) {}

  async findFirst(clientId: string, clientSecret: string) {
    return this.repository.findOneOrFail({
      where: {
        id: clientId,
        secret: clientSecret,
        disabled: false,
      },
    });
  }
}
