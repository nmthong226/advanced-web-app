// daily-analytics.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DailyAnalyticsDocument = DailyAnalytics & Document;

@Schema()
export class DailyAnalytics {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: string; // Store date as string in YYYY-MM-DD format

  @Prop({ default: 0 })
  total_time_spent: number;

  @Prop({ default: 0 })
  total_time_rest: number;

  @Prop({ default: 0 })
  task_completed: number;

  @Prop({ default: 0 })
  tasks_expired: number;
}

export const DailyAnalyticsSchema =
  SchemaFactory.createForClass(DailyAnalytics);
