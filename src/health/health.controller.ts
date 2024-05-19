import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/types';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // This will check if the database is available
      () => this.typeOrmHealthIndicator.pingCheck('db'),
      // This will check if the memory heap is below 150MB
      () => this.memoryHealthIndicator.checkHeap('mem', 150 * 1024 * 1024),
      // This will check if the storage is below 75% full
      () =>
        this.diskHealthIndicator.checkStorage('disk', {
          thresholdPercent: 0.75,
          path: '/',
        }),
    ]);
  }
}
