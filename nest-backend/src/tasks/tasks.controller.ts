// src/tasks/tasks.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './tasks.dto';
import { Task } from './tasks.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard'; // Ensure AuthGuard is implemented
import { Request } from 'express';

@ApiTags('tasks') // Groups routes under 'tasks' in Swagger UI
@Controller('tasks')

export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve tasks for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully.',
    type: [Task],
  })
  async getTasksForAuthenticatedUser(@Req() req: Request): Promise<Task[]> {
    const userId = req['user']?.userId; // Retrieve userId from the request
    return await this.tasksService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.', type: Task })
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Task created successfully.', type: Task })
  async createTask(@Req() req: Request, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const userId = req['user']?.userId; // Retrieve userId from the request
    return await this.tasksService.createTask({ ...createTaskDto, userId });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.', type: Task })
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a task' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiResponse({ status: 200, description: 'Task status updated successfully.', type: Task })
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    return await this.tasksService.deleteTask(id);
  }
}
