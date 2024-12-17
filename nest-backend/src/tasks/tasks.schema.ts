import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the TaskPriority and TaskStatus as TypeScript types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'expired';

// Interface for TaskStyle
export interface TaskStyle {
  backgroundColor: string;
  textColor: string;
}

// Define the Task Document type for Mongoose
export type TaskDocument = Task & Document;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt fields automatically
export class Task {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  priority: TaskPriority;

  @Prop({
    required: true,
    enum: ['pending', 'in-progress', 'completed', 'expired'],
  })
  status: TaskStatus;

  @Prop({ type: Date, required: false })
  startDate?: Date;

  @Prop({ type: Date, required: false })
  endDate?: Date;

  @Prop({ type: Date, required: false })
  dueTime?: Date;

  @Prop({ type: Number, required: false })
  estimatedTime?: number;

  @Prop({
    type: {
      backgroundColor: { type: String, required: true },
      textColor: { type: String, required: true },
    },
    required: false,
  })
  style?: TaskStyle;

  @Prop({ type: Boolean, default: false })
  isOnCalendar?: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
