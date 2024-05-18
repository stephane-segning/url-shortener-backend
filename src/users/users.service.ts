import { QueryService } from '@ptc-org/nestjs-query-core';
import { UserEntity } from './user.entity';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryService(UserEntity)
export class UsersService extends TypeOrmQueryService<UserEntity> {
  constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
    super(repo);
  }

  public async findUserByUsername(
    username: string,
  ): Promise<UserEntity | null> {
    const res = await this.query({
      filter: { username: { eq: username } },
    });
    if (res.length === 0) {
      return null;
    }
    return res[0];
  }
}
