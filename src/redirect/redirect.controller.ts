import {
  Controller,
  Get,
  HostParam,
  Logger,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Request, Response } from 'express';
import { lookup } from 'geoip-lite';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/types';

@ApiTags('Redirect')
@Controller({ host: ':host', path: 'r' })
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  constructor(private readonly service: RedirectService) {}

  @Public()
  @Get(':code_id')
  public async redirect(
    @HostParam('host') host: string,
    @Param('code_id') codeId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { isRedirect, redirectUrl, render, status } =
      await this.service.redirect({
        codeId,
        host,
        userAgent: req.useragent,
        lookup: lookup(req.clientIp),
        cookies: req.cookies,
      });

    if (isRedirect) {
      return res.redirect(redirectUrl);
    }

    if (render) {
      return res.status(status).render(render, { codeId });
    }

    return res.status(404).render('no-code', { codeId });
  }
}
