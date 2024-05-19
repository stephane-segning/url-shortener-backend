import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  controllers: [MetricsController],
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}
