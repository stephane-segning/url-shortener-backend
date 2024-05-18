import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import OAuth2Server from 'oauth2-server';
import { Response } from 'express';
import { fromOauthToken, RegisterAccount } from './types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauth2Server: OAuth2Server,
  ) {}

  @HttpCode(200)
  @Post('token')
  async token(@Req() req: Request, @Res() res: Response) {
    try {
      const request = new OAuth2Server.Request(req);
      const response = new OAuth2Server.Response(res);
      const token = await this.oauth2Server.token(request, response);
      res.send(fromOauthToken(token));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get('authenticate')
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const token = await this.oauth2Server.authenticate(request, response);
    res.send(fromOauthToken(token));
  }

  @HttpCode(201)
  @Post('register')
  async registerAccount(@Body() input: RegisterAccount) {
    return await this.authService.create(input.username, input.password);
  }
}
