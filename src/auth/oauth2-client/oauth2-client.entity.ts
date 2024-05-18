import { Column, Entity, OneToMany } from 'typeorm';
import { OAuth2TokenEntity } from '../oauth2-token/oauth2-token.entity';
import { AbstractEntity } from '@/shared/abstract.entity';

@Entity({ name: 'oauth2_clients' })
export class Oauth2ClientEntity extends AbstractEntity {
  @Column({ name: 'secret', nullable: true })
  secret!: string;

  @Column({ name: 'redirect_uris', type: 'simple-array' })
  redirectUris!: string[];

  @Column({ name: 'grants', type: 'simple-array' })
  grants!: string[];

  @Column({ name: 'scopes', type: 'simple-array' })
  scopes!: string[];

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  accessTokenLifetime!: number;

  @Column()
  refreshTokenLifetime!: number;

  @Column({ default: false })
  disabled!: boolean;

  @OneToMany(() => OAuth2TokenEntity, (token) => token.client)
  tokens: OAuth2TokenEntity[];

  get clientId(): string {
    return this.id!;
  }
}
