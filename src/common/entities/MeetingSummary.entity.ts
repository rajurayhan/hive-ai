import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export const MeetingSummaryTableName = 'meeting_transcripts';

@Entity(MeetingSummaryTableName)

@Entity('meeting_summaries')
export class MeetingSummary {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  transcriptText: string;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  meetingSummeryText: string;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  meetingName: string;

  @Column({ type: 'int' })
  meetingType: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  clickupLink: string;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  tldvLink: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  createdById: number;

  @Column({ type: 'tinyint', width: 1, default: () => '0' })
  is_private: boolean;

}
