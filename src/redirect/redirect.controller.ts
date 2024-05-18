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

@ApiTags('Redirect')
@Controller({ host: ':host', path: 'r' })
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  constructor(private readonly service: RedirectService) {}

  @Get(':code_id')
  public async redirect(
    @HostParam('host') host: string,
    @Param('code_id') codeId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.debug(`Redirecting using code ${codeId}`);
    const { isRedirect, redirectUrl, render } = await this.service.redirect({
      codeId,
      host,
      userAgent: req.useragent,
      lookup: lookup(req.clientIp),
    });
    if (isRedirect) {
      return res.redirect(redirectUrl);
    }
    if (render) {
      return res.render(render);
    }
    return res.render('no-code');
  }
}
