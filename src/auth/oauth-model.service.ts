import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  BaseModel,
  Client,
  Falsey,
  PasswordModel,
  RefreshToken,
  RefreshTokenModel,
  Token,
  User,
} from 'oauth2-server';
import jwt, { Algorithm } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import moment from 'moment';
import { UserEntity } from '@/users/user.entity';
import { Oauth2ClientEntity } from './oauth2-client/oauth2-client.entity';
import { Oauth2ClientService } from './oauth2-client/oauth2-client.service';
import { Oauth2TokenService } from './oauth2-token/oauth2-token.service';
import { Oauth2KeyService } from './oauth2-key/oauth2-key.service';
import { OAuth2TokenEntity } from './oauth2-token/oauth2-token.entity';

@Injectable()
export class OauthModelService
  implements BaseModel, RefreshTokenModel, PasswordModel
{
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: Oauth2ClientService,
    private readonly tokenService: Oauth2TokenService,
    private readonly keyService: Oauth2KeyService,
  ) {}

  public getUser(username: string, password: string): Promise<User | Falsey> {
    return this.authService.authenticate(username, password);
  }

  public async validateScope(
    user: User,
    client: Client,
    scope: string | string[],
  ): Promise<string | false | 0 | string[]> {
    return scope;
  }

  public async generateRefreshToken(
    client: Client,
    user: User,
    scope: string | string[],
  ): Promise<string> {
    return await this.generateRefreshTokenString(
      user as UserEntity,
      client as Oauth2ClientEntity,
      scope,
    );
  }

  public async getRefreshToken(
    refreshToken: string,
  ): Promise<Falsey | RefreshToken> {
    const found = await this.tokenService.getRefreshToken(refreshToken);
    if (!found) return false;
    return (await this.convertToOauthToken(found)) as RefreshToken;
  }

  public async revokeToken(token: Token | RefreshToken): Promise<boolean> {
    await this.tokenService.removeToken(token.accessToken, token.refreshToken);
    return true;
  }

  public async getAccessToken(accessToken: string): Promise<Falsey | Token> {
    const found = await this.tokenService.getAccessToken(accessToken);
    if (!found) return false;
    return (await this.convertToOauthToken(found)) as Token;
  }

  public async verifyScope(
    token: Token,
    scope: string | string[],
  ): Promise<boolean> {
    const tokenScopes = Array.isArray(token.scope)
      ? token.scope
      : (token.scope ?? '').split(',');
    return Array.isArray(scope)
      ? scope.every((s) => tokenScopes.includes(s))
      : tokenScopes.includes(scope);
  }

  public async generateAccessToken(
    client: Client,
    user: User,
    scope: string | string[],
  ): Promise<string> {
    return await this.generateAccessTokenString(
      user as UserEntity,
      client as Oauth2ClientEntity,
      scope,
    );
  }

  public async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<Client | Falsey> {
    const client = await this.clientService.findFirst(clientId, clientSecret);
    if (!client) return false;
    return client;
  }

  public async saveToken(
    token: Token,
    client: Client,
    user: User,
  ): Promise<Falsey | Token> {
    const scope = Array.isArray(token.scope)
      ? token.scope.join(',')
      : token.scope ?? '';

    const toCreate = new OAuth2TokenEntity();
    toCreate.accessToken = token.accessToken;
    toCreate.accessTokenExpiresAt = moment(token.accessTokenExpiresAt).unix();
    toCreate.refreshToken = token.refreshToken;
    toCreate.refreshTokenExpiresAt = moment(token.refreshTokenExpiresAt).unix();
    toCreate.scope = scope.split(',');
    toCreate.client_id = client.id;
    toCreate.user_id = user.id;

    const saved = await this.tokenService.save(toCreate);

    return {
      ...saved,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      user,
      client,
    };
  }

  private async convertToOauthToken(
    token: OAuth2TokenEntity,
  ): Promise<Token | RefreshToken> {
    return {
      ...token,
      accessTokenExpiresAt: moment({
        seconds: token.accessTokenExpiresAt,
      }).toDate(),
      refreshTokenExpiresAt: moment({
        seconds: token.refreshTokenExpiresAt,
      }).toDate(),
    };
  }

  private async generateAccessTokenString(
    account: UserEntity,
    client: Oauth2ClientEntity,
    scope: string | string[],
  ) {
    const [privateKey, algo] = await this.getLastPrismaKeyPrivateKey();
    const scopes = Array.isArray(scope) ? scope : [scope];
    const payload: Record<string, string | string[]> = {
      username: account.username,
      sub: account.id,
      iss: 'imarkedit',
      aud: client.id,
      scopes: scopes.filter((s) => !!s),
    };
    return jwt.sign(payload, privateKey, {
      algorithm: algo,
      expiresIn: client.accessTokenLifetime,
    });
  }

  private async generateRefreshTokenString(
    account: UserEntity,
    client: Oauth2ClientEntity,
    scope: string | string[],
  ) {
    const [privateKey, algo] = await this.getLastPrismaKeyPrivateKey();
    const scopes = Array.isArray(scope) ? scope : [scope];
    const payload: Record<string, string | string[]> = {
      sub: account.id,
      iss: 'imarkedit',
      aud: client.id,
      scopes: scopes.filter((s) => !!s),
    };
    return jwt.sign(payload, privateKey, {
      algorithm: algo,
      expiresIn: client.refreshTokenLifetime,
    });
  }

  private async getLastPrismaKeyPrivateKey(): Promise<[string, Algorithm]> {
    const found = await this.keyService.findLast();
    if (!found) {
      throw new InternalServerErrorException('No active key found');
    }
    const { privateData } = found;
    return [privateData.privateKey as string, privateData.algo as Algorithm];
  }
}
