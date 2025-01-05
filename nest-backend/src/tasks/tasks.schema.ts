import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  status: 'pending' | 'in-progress' | 'completed' | 'expired';
  
  @Prop({ required: true })
  priority: 'low' | 'medium' | 'high';

  @Prop()
  category: string;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop()
  dueTime?: Date;

  // time needed to do this task, in minutes
  @Prop()
  estimatedTime?: number;

  @Prop()
  pomodoro_required_number: number;

  @Prop()
  pomodoro_number: number;

  @Prop()
  is_on_pomodoro_list: boolean;

  @Prop()
  is_on_calendar: boolean;

  @Prop({
    type: {
      backgroundColor: { type: String },
      textColor: { type: String },
    },
  })
  style?: { backgroundColor: string; textColor: string };
}

export const TaskSchema = SchemaFactory.createForClass(Task);
