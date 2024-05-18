import { BeforeInsert, Column, DeleteDateColumn, Entity } from 'typeorm';
import { AbstractEntity } from '@/shared/abstract.entity';
import { slug } from 'cuid';

@Entity({ name: 'codes' })
export class CodesEntity extends AbstractEntity {
  @Column({ unique: true, update: false })
  smallCode!: string;

  @Column()
  active!: boolean;

  @Column({ name: 'custom_script', nullable: true })
  customScript?: string | undefined;

  @Column({ name: 'redirect_url', nullable: true })
  redirectUrl?: string | undefined;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @BeforeInsert()
  public generateCode() {
    if (!this.smallCode) {
      this.smallCode = slug();
    }
  }
}
