import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@/shared/abstract.entity';

@Entity({ name: 'oauth2_keys' })
export class Oauth2KeyEntity extends AbstractEntity {
  @Column({ name: 'public_data', type: 'simple-json', nullable: true })
  publicData?: Record<string, any>;

  @Column({ name: 'private_data', type: 'simple-json', nullable: true })
  privateData?: Record<string, any>;

  @Column()
  active!: boolean;
}
