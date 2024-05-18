import { Module } from '@nestjs/common';
import { Oauth2ClientService } from './oauth2-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2ClientEntity } from './oauth2-client.entity';

@Module({
  providers: [Oauth2ClientService],
  imports: [TypeOrmModule.forFeature([Oauth2ClientEntity])],
  exports: [Oauth2ClientService],
})
export class Oauth2ClientModule {}
