import { Injectable, Logger } from '@nestjs/common';
import { RedirectModel, RedirectResponse } from './redirect.model';
import { CodesService } from '@/codes/codes.service';
import * as vm from 'node:vm';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { REDIRECT_REQUESTS_TOTAL } from '@/redirect/constants';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(
    private readonly codeService: CodesService,
    @InjectMetric(REDIRECT_REQUESTS_TOTAL)
    private readonly counter: Counter<string>,
  ) {}

  async redirect(options: RedirectModel): Promise<RedirectResponse> {
    this.logger.debug(`Redirecting to ${options.codeId}`);
    const found = await this.codeService.findCodeByCode(options.codeId);
    if (!found) {
      this.logger.debug(`Code not found ${options.codeId}`);
      this.counter.inc({
        codeId: options.codeId,
        success: 'false',
        method: '',
        host: options.host,
      });
      return {
        render: 'not-found',
        redirectUrl: '',
        isRedirect: false,
        status: 404,
      };
    }

    this.logger.debug(`Found code ${options.codeId}`);
    if (found.redirectUrl) {
      this.logger.debug(`Redirecting to ${found.redirectUrl}`);
      this.counter.inc({
        codeId: options.codeId,
        success: 'true',
        method: 'plain',
        host: options.host,
      });
      return { redirectUrl: found.redirectUrl, isRedirect: true, status: 302 };
    }

    if (found.customScript) {
      this.logger.debug(`Running custom script for ${options.codeId}`);
      const script = new vm.Script(found.customScript);
      const contextObj = {
        redirectUrl: '',
        status: 302,
        isRedirect: false,
        options,
      };
      const context = vm.createContext(contextObj);
      script.runInContext(context);

      this.counter.inc({
        codeId: options.codeId,
        success: 'true',
        method: 'script',
        host: options.host,
      });

      this.logger.debug(`Custom script result ${contextObj.redirectUrl}`);
      return {
        redirectUrl: contextObj.redirectUrl,
        isRedirect: true,
        status: contextObj.status,
      };
    }

    this.counter.inc({
      codeId: options.codeId,
      success: 'false',
      method: 'none',
      host: options.host,
    });
    this.logger.debug(`No redirect url found for ${options.codeId}`);
    return {
      render: 'not-handled',
      redirectUrl: '',
      isRedirect: false,
      status: 501,
    };
  }
}
