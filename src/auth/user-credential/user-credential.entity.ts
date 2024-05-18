import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@/users/user.entity';
import { AbstractEntity } from '@/shared/abstract.entity';

@Entity({ name: 'user_credentials' })
export class UserCredentialEntity extends AbstractEntity {
  @Column({ name: 'public_data', type: 'simple-json', nullable: true })
  publicData?: Record<string, any>;

  @Column({ name: 'private_data', type: 'simple-json', nullable: true })
  privateData?: Record<string, any>;

  @Column()
  active!: boolean;

  @Column({ type: 'simple-enum', enum: ['password'] })
  type!: 'password';

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: true })
  user_id!: string;
}
