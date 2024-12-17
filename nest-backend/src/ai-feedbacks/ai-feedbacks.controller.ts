// ai-feedbacks.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiFeedbacksService } from './ai-feedbacks.service';
// import { IsString, IsArray, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// // DTO for individual task
// class TaskDto {
//   @IsString()
//   _id: string;

//   @IsString()
//   title: string;

//   @IsString()
//   priority: string;

//   @IsString()
//   estimated_time: string;

//   @IsString()
//   start_time: string;

//   @IsString()
//   end_time: string;
// }

// class AnalyzeScheduleDto {
//   @IsString()
//   userId: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => TaskDto)
//   tasks: TaskDto[];

//   @IsString()
//   user_prompt: string;
// }

@Controller('ai-feedbacks')
export class AiFeedbacksController {
  constructor(private readonly aiFeedbacksService: AiFeedbacksService) {} 

  @Post('analyze-schedule')
  async analyzeSchedule(@Body() analyzeScheduleDto) {
    try {
      const { userId, tasks, user_prompt } = analyzeScheduleDto;

      if (!userId) {
        throw new BadRequestException('UserId is required.');
      }

      if (!tasks) {
        throw new BadRequestException('Tasks array cannot be empty.');
      }

      const feedback = await this.aiFeedbacksService.analyzeTasks(userId, tasks, user_prompt);

      return { feedback };
    } catch (error) {
      console.error('Error analyzing schedule:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to analyze the schedule. Please ensure the input is correct.');
    }
  }
}
