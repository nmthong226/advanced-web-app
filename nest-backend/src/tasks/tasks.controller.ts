// src/tasks/tasks.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { UpdateTaskStatusDto } from './tasks.dto'; // Import the new DTO
import { Task } from './tasks.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('tasks') // Groups routes under 'tasks' in Swagger UI
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks retrieved successfully.', type: [Task] })
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve tasks for a specific user' })
  @ApiResponse({ status: 200, description: 'List of user tasks retrieved successfully.', type: [Task] })
  async getTasksByUserId(@Param('userId') userId: string): Promise<Task[]> {
    return await this.tasksService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.', type: Task })
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.', type: Task })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
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
  @ApiResponse({ status: 404, description: 'Task not found.' })
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
