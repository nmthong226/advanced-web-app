import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  id: string;

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

  @Prop()
  estimatedTime?: number;

  @Prop({
    type: {
      backgroundColor: { type: String },
      textColor: { type: String },
    },
  })
  style?: { backgroundColor: string; textColor: string };
}

export const TaskSchema = SchemaFactory.createForClass(Task);