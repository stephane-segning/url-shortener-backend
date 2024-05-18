import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialService } from './user-credential.service';
import { UserCredentialEntity } from './user-credential.entity';

@Module({
  providers: [UserCredentialService],
  imports: [TypeOrmModule.forFeature([UserCredentialEntity])],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
