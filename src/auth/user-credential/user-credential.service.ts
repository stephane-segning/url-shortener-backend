import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialEntity } from './user-credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCredentialService {
  private readonly logger = new Logger(UserCredentialService.name);
  private readonly saltRounds = 10;
  private readonly passwordKey = 'password-value';

  constructor(
    @InjectRepository(UserCredentialEntity)
    private readonly repository: Repository<UserCredentialEntity>,
  ) {}

  public async comparePassword(userId: string, challenge: string) {
    this.logger.debug(`Comparing password for user ${userId}`);
    const credential = await this.findUserPassword(userId);
    if (!credential) {
      return false;
    }
    return bcrypt.compare(challenge, credential.privateData[this.passwordKey]);
  }

  public async createPassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashed = await bcrypt.hash(password, salt);

    this.logger.debug(`Deleting existing password for user ${userId}`);
    await this.repository.delete({
      user_id: userId,
      type: 'password',
    });

    this.logger.debug(`Creating password for user ${userId}`);
    const created = this.repository.create({
      user_id: userId,
      type: 'password',
      privateData: {
        [this.passwordKey]: hashed,
        salt,
      },
      active: true,
    });
    await this.repository.save(created);
  }

  private async findUserPassword(userId: string) {
    this.logger.debug(`Finding password for user ${userId}`);
    const userCred = await this.repository.findOne({
      where: {
        user_id: userId,
        type: 'password',
      },
    });

    if (!userCred) {
      return null;
    }

    return userCred;
  }
}
