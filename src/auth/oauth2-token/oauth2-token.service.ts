import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuth2TokenEntity } from './oauth2-token.entity';

@Injectable()
export class Oauth2TokenService {
  constructor(
    @InjectRepository(OAuth2TokenEntity)
    private readonly repository: Repository<OAuth2TokenEntity>,
  ) {}

  public async save(model: OAuth2TokenEntity): Promise<OAuth2TokenEntity> {
    const toCreate = this.repository.create(model);
    return await this.repository.save(toCreate);
  }

  public async getAccessToken(accessToken: string): Promise<OAuth2TokenEntity> {
    return this.repository.findOne({
      where: {
        accessToken,
      },
      relations: ['user', 'client'],
    });
  }

  public async removeToken(
    accessToken: string | any,
    refreshToken: string,
  ): Promise<void> {
    await this.repository.delete({
      accessToken,
      refreshToken,
    });
  }

  public async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2TokenEntity> {
    const found = await this.repository.findOne({
      where: {
        refreshToken,
      },
      relations: ['user', 'client'],
    });

    if (!found) {
      return null;
    }

    return found;
  }
}
