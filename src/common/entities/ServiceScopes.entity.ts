import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AppBaseEntity } from './base/app-base.entity';


export const ServiceScopesTableName = 'service_scopes';

@Entity(ServiceScopesTableName)
export class ServiceScopesEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  name: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  serviceGroupId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  serviceId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  projectTypeId: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  order: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
