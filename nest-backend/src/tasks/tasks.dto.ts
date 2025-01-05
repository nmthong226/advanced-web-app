import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'New status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: pending, in-progress, completed, expired',
  })
  status: TaskStatus;
}

export class CreateTaskDto {
 

  @IsString()
  @ApiProperty({ description: 'User ID for the task owner' })
  userId: string; // User ID the task belongs to

  @IsString()
  @ApiProperty({ description: 'Title of the task' })
  title: string; // Task title

  @IsEnum(TaskStatus)
  @ApiProperty({ description: 'Status of the task', enum: TaskStatus })
  status: TaskStatus; // Task status (e.g., "pending", "in-progress", "completed", "expired")

  @IsString()
  @ApiProperty({ description: 'Category or label for the task' })
  category: string; // Task category

  @IsEnum(TaskPriority)
  @ApiProperty({ description: 'Priority level of the task', enum: TaskPriority })
  priority: TaskPriority; // Task priority (e.g., "low", "medium", "high")

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Optional task description' })
  description?: string; // Task description (optional)

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'Start date of the task' })
  startTime?: Date; // Task start date (optional)

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'End date of the task' })
  endTime?: Date; // Task end date (optional)

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'Due date for the task' })
  dueTime?: Date; // Task due time (optional)

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Estimated time to complete the task in minutes' })
  estimatedTime?: number; // Estimated time in minutes (optional)

  @IsNumber()
  @ApiProperty({ description: 'Number of Pomodoro intervals required for the task' })
  pomodoro_required_number: number; // Pomodoro intervals required for task

  @IsNumber()
  @ApiProperty({ description: 'Pomodoro intervals completed so far for the task' })
  pomodoro_number: number; // Number of Pomodoro intervals completed so far

  @IsBoolean()
  @ApiProperty({ description: 'Is task on Pomodoro list' })
  is_on_pomodoro_list: boolean; // Whether task is on Pomodoro list

  @IsBoolean()
  @ApiProperty({ description: 'Is task shown on calendar' })
  is_on_calendar: boolean; // Whether task is on calendar
}

export class UpdateTaskDto {
  

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User ID for the task owner' })
  userId?: string; // Optional user ID (not typically updated)

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional task title update' })
  title?: string; // Optional task title update

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({ description: 'Optional task status update', enum: TaskStatus })
  status?: TaskStatus; // Optional task status update

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional task category update' })
  category?: string; // Optional task category update

  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiProperty({ description: 'Optional task priority update', enum: TaskPriority })
  priority?: TaskPriority; // Optional task priority update

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional task description update' })
  description?: string; // Optional task description update

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Optional task start date update' })
  startTime?: Date; // Optional task start date update

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Optional task end date update' })
  endTime?: Date; // Optional task end date update

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Optional task due time update' })
  dueTime?: Date; // Optional task due time update

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Optional estimated time update' })
  estimatedTime?: number; // Optional estimated time update

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Optional number of Pomodoro intervals required update' })
  pomodoro_required_number?: number; // Optional pomodoro required number update

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Optional number of Pomodoro intervals completed update' })
  pomodoro_number?: number; // Optional pomodoro number update

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Is task on Pomodoro list' })
  is_on_pomodoro_list?: boolean; // Optional task Pomodoro list update

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Is task on calendar' })
  is_on_calendar?: boolean; // Optional task calendar update
}
