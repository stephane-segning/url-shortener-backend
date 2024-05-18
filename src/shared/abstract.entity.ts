import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import cuid from 'cuid';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'text',
  })
  id!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @VersionColumn()
  version: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = cuid();
    }
  }
}
