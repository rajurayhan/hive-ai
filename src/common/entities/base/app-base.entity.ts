import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;
}
