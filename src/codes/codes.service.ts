import { QueryService } from '@ptc-org/nestjs-query-core';
import { CodesEntity } from './codes.entity';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@QueryService(CodesEntity)
export class CodesService extends TypeOrmQueryService<CodesEntity> {
  constructor(@InjectRepository(CodesEntity) repo: Repository<CodesEntity>) {
    super(repo, { useSoftDelete: true });
  }

  public async findCodeByCode(code: string): Promise<CodesEntity | null> {
    const res = await this.query({
      filter: { smallCode: { eq: code } },
    });
    if (res.length === 0) {
      return null;
    }
    return res[0];
  }
}
