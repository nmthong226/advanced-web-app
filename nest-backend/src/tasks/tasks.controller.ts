import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { Task } from './tasks.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.findAll();
  }

  @Get('user/:userId')
  getTasksByUserId(@Param('userId') userId: string): Task[] {
    return this.tasksService.findByUserId(userId);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.findOne(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Task {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }
}
