import { Module } from '@nestjs/common';
import { Oauth2KeyService } from './oauth2-key.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2KeyEntity } from './oauth2-key.entity';

@Module({
  providers: [Oauth2KeyService],
  imports: [TypeOrmModule.forFeature([Oauth2KeyEntity])],
  exports: [Oauth2KeyService],
})
export class Oauth2KeyModule {}
