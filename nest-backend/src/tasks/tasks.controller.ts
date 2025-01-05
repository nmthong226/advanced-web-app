import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Put,
  HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './tasks.dto';
import { Task } from './tasks.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Post('mock-data')
  async generateMockTasks() {
    return await this.tasksService.generateMockTasks();
  }

  @Get('user/:userId')
  async getTasksByUserId(@Param('userId') userId: string): Promise<Task[]> {
    return await this.tasksService.findByUserId(userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Post()
  async createTask(@Body() createTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Put(':id/status') 
  @HttpCode(200) // Explicitly set success code (200 OK)
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() status,
  ): Promise<Task> {
    try {
      const updatedTask = await this.tasksService.updateTaskStatus(
        id,
        status,
      );
      return updatedTask;
    } catch (error) {
      throw error; // Re-throw the error for global exception handling
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    return await this.tasksService.deleteTask(id);
  }
}
