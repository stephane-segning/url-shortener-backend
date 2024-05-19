import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { CodesModule } from '@/codes/codes.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { REDIRECT_REQUESTS_TOTAL } from '@/redirect/constants';

@Module({
  controllers: [RedirectController],
  providers: [
    RedirectService,
    makeCounterProvider({
      name: REDIRECT_REQUESTS_TOTAL,
      help: 'Total number of redirect requests by code',
      labelNames: ['codeId', 'success', 'method', 'host'] as const,
    }),
  ],
  imports: [CodesModule],
})
export class RedirectModule {}
