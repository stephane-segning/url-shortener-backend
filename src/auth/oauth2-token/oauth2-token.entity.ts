import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Oauth2ClientEntity } from '../oauth2-client/oauth2-client.entity';
import { UserEntity } from '@/users/user.entity';
import { AbstractEntity } from '@/shared/abstract.entity';

@Entity({ name: 'oauth2_tokens' })
export class OAuth2TokenEntity extends AbstractEntity {
  @Column({ name: 'access_token' })
  accessToken!: string;

  @Column({ name: 'access_token_expires_at' })
  accessTokenExpiresAt!: number;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column({ name: 'refresh_token_expires_at', nullable: true })
  refreshTokenExpiresAt?: number;

  @Column({ name: 'scopes', type: 'simple-array' })
  scope!: string[];

  @Column()
  active!: boolean;

  @ManyToOne(() => Oauth2ClientEntity, (client) => client.tokens)
  @JoinColumn({ name: 'client_id' })
  client: Oauth2ClientEntity;

  @Column({ name: 'client_id', nullable: true })
  client_id!: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: true })
  user_id!: string;
}
