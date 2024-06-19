import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MeetingTranscriptEntity } from './MeetingTranscript.entity';

@Entity('problems_and_goals')
export class ProblemAndGoalEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  transcriptId: number;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  problemGoalText: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(() => MeetingTranscriptEntity, meetingTranscript => meetingTranscript.id)
  @JoinColumn({ name: 'transcriptId' })
  transcriptInfo: MeetingTranscriptEntity;
}
