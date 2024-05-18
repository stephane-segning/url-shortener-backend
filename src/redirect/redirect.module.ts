import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { CodesModule } from '@/codes/codes.module';

@Module({
  controllers: [RedirectController],
  providers: [RedirectService],
  imports: [CodesModule],
})
export class RedirectModule {}
