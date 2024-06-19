import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AppBaseEntity } from './base/app-base.entity';


export const MeetingTranscriptTableName = 'meeting_transcripts';

@Entity(MeetingTranscriptTableName)
export class MeetingTranscriptEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  projectName: string;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  assistant_id: string;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  thread_id: string;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  company: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  clientPhone: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  clientEmail: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  clientWebsite: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  serviceId: number;
}
