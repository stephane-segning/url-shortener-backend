import { Injectable } from '@nestjs/common';
import { RedirectModel, RedirectResponse } from './redirect.model';
import { CodesService } from '@/codes/codes.service';
import * as vm from 'node:vm';

@Injectable()
export class RedirectService {
  constructor(private readonly codeService: CodesService) {}

  async redirect(options: RedirectModel): Promise<RedirectResponse> {
    const found = await this.codeService.findCodeByCode(options.codeId);
    if (!found) {
      return {
        render: 'not-found',
        redirectUrl: '',
        isRedirect: false,
        status: 404,
      };
    }
    if (found.redirectUrl) {
      return { redirectUrl: found.redirectUrl, isRedirect: true, status: 302 };
    }

    if (found.customScript) {
      const script = new vm.Script(found.customScript);
      const contextObj = {
        redirectUrl: '',
        status: 302,
        isRedirect: false,
        options,
      };
      const context = vm.createContext(contextObj);
      script.runInContext(context);
      return {
        redirectUrl: contextObj.redirectUrl,
        isRedirect: true,
        status: contextObj.status,
      };
    }

    return {
      render: 'not-handled',
      redirectUrl: '',
      isRedirect: false,
      status: 501,
    };
  }
}
