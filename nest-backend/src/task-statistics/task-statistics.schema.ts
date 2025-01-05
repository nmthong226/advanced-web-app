//task-statistics.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskStatisticsDocument = TaskStatistics & Document;

@Schema()
export class TaskStatistics {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  day: string; // Store date as string in YYYY-MM-DD format

  @Prop({ required: true })
  taskStatus: string; // 'pending', 'in-progress', 'completed', 'expired'

  @Prop({ default: 0 })
  taskCount: number;
}

export const TaskStatisticsSchema =
  SchemaFactory.createForClass(TaskStatistics);
