import { Column, Entity, OneToMany } from 'typeorm';
import { OAuth2TokenEntity } from '@/auth/oauth2-token/oauth2-token.entity';
import { UserCredentialEntity } from '@/auth/user-credential/user-credential.entity';
import { AbstractEntity } from '@/shared/abstract.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  username!: string;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => OAuth2TokenEntity, (token) => token.client)
  tokens: OAuth2TokenEntity[];

  @OneToMany(() => UserCredentialEntity, (cred) => cred.user)
  credentials: UserCredentialEntity[];
}
