import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Task } from 'src/tasks/tasks.schema';

// Define the User interface
export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt
export class User {
  @Prop({ required: false })
  userId?: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  tasks: Task[];

  @Prop({
    type: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },
  })
  settings?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
