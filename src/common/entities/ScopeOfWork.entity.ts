import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProblemAndGoalEntity } from './ProblemsAndGoals.entity';

@Entity('scope_of_works')
export class ScopeOfWorkEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  problemGoalID: number;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  scopeText: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  transcriptId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  serviceScopeId: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  title: string;

  @Column({ type: 'int', default: 1, comment: '0: Active, 1: Inactive' })
  isChecked: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  batchId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  additionalServiceId: number;

  @ManyToOne(() => ProblemAndGoalEntity, problemAndGoal => problemAndGoal.id)
  @JoinColumn({ name: 'problemGoalID' })
  problemGoalInfo: ProblemAndGoalEntity;
}
