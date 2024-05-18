import { Module } from '@nestjs/common';
import { Oauth2TokenService } from './oauth2-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2TokenEntity } from './oauth2-token.entity';

@Module({
  providers: [Oauth2TokenService],
  imports: [TypeOrmModule.forFeature([OAuth2TokenEntity])],
  exports: [Oauth2TokenService],
})
export class Oauth2TokenModule {}
