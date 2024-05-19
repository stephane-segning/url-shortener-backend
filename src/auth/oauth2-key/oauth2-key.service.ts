import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oauth2KeyEntity } from './oauth2-key.entity';
import { generateKeyPair } from '@/shared/crypto';

@Injectable()
export class Oauth2KeyService {
  constructor(
    @InjectRepository(Oauth2KeyEntity)
    private readonly repository: Repository<Oauth2KeyEntity>,
  ) {}

  async findLast() {
    return await this.repository.findOne({
      order: { created: 'DESC' },
      where: { active: true },
    });
  }

  async createBaseKey() {
    const found = await this.findLast();

    if (found) {
      return;
    }

    const keyPair = await generateKeyPair();

    const entity = this.repository.create({
      active: true,
      publicData: {
        publicKey: keyPair.publicKey,
      },
      privateData: {
        privateKey: keyPair.privateKey,
        algo: 'RS256',
      },
    });

    await this.repository.save(entity);
  }
}
