import OAuth2Server from 'oauth2-server';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OauthModelService } from './oauth-model.service';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { Oauth2TokenModule } from './oauth2-token/oauth2-token.module';
import { Oauth2KeyModule } from './oauth2-key/oauth2-key.module';
import { UserCredentialModule } from './user-credential/user-credential.module';
import { UsersModule } from '@/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [
    OauthModelService,
    AuthService,
    {
      provide: OAuth2Server,
      useFactory: (service: OauthModelService) => {
        return new OAuth2Server({
          model: service,
          extendedGrantTypes: {},
          requireClientAuthentication: {
            password: false,
          },
        });
      },
      inject: [OauthModelService],
    },
  ],
  imports: [
    Oauth2ClientModule,
    Oauth2TokenModule,
    Oauth2KeyModule,
    UserCredentialModule,
    UsersModule,
  ],
})
export class AuthModule {}
