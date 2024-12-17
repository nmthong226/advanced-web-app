import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'expired';

export interface TaskStyle {
  backgroundColor: string;
  textColor: string;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  description?: string;
  @Column()
  category: string;
  @Column()
  priority: TaskPriority;
  @Column()
  status: TaskStatus;
  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;
  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;
  @Column({ type: 'timestamp', nullable: true })
  dueTime?: Date;
  @Column({ type: 'float', nullable: true })
  estimatedTime?: number;
  @Column({ type: 'json', nullable: true }) // Store task styles as JSON
  style?: TaskStyle;
  @Column({ type: 'boolean', default: false })
  isOnCalendar?: boolean | false;
}
