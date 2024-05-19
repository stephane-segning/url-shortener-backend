import type { Token } from 'oauth2-server';
import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';

export class AppToken {
  constructor(
    public readonly accessToken: string,
    public readonly accessTokenExpiresAt?: number | undefined,
    public readonly refreshToken?: string | undefined,
    public readonly refreshTokenExpiresAt?: number | undefined,
    public readonly scope?: string,
  ) {}
}

export function fromOauthToken(token: Token): AppToken {
  return new AppToken(
    token.accessToken,
    token.accessTokenExpiresAt?.getTime(),
    token.refreshToken,
    token.refreshTokenExpiresAt?.getTime(),
    Array.isArray(token.scope) ? token.scope.join(' ') : token.scope,
  );
}

export class RegisterAccount {
  @IsDefined()
  @IsString()
  @ApiProperty()
  username: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  password: string;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
