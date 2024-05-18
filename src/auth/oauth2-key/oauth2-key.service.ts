import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oauth2KeyEntity } from './oauth2-key.entity';

@Injectable()
export class Oauth2KeyService {
  constructor(
    @InjectRepository(Oauth2KeyEntity)
    private readonly repository: Repository<Oauth2KeyEntity>,
  ) {}

  async findLast() {
    return this.repository.findOneOrFail({
      order: { created: 'DESC' },
      where: { active: true },
    });
  }
}
