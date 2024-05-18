import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UserCredentialService } from './user-credential/user-credential.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly credentialService: UserCredentialService,
  ) {}

  @Transactional()
  async create(username: string, password: string) {
    this.logger.debug(`Creating user ${username}`);
    const user = await this.userService.createOne({
      username,
    });
    await this.credentialService.createPassword(user.id, password);
    this.logger.debug(`User ${username} created`);
  }

  async authenticate(username: string, password: string) {
    this.logger.debug(`Authenticating user ${username}`);
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      return null;
    }

    this.logger.debug(`User ${username} found`);
    const isValid = await this.credentialService.comparePassword(
      user.id,
      password,
    );

    this.logger.debug(`User ${username} authenticated: ${isValid}`);
    if (!isValid) {
      return null;
    }

    this.logger.debug(`User ${username} authenticated`);
    return user;
  }
}
