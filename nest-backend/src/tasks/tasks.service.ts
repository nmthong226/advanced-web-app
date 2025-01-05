import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';
import { TaskStatistics } from '../task-statistics/task-statistics.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskStatistics.name)
    private taskStatisticsModel: Model<TaskStatistics>,
  ) {}

  // Get all tasks
  async findAll(): Promise<Task[]> {
    return await this.taskModel.find().exec();
  }

  // Get tasks by User ID
  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ userId }).exec();
    if (!tasks.length) {
      throw new NotFoundException(`No tasks found for user ID ${userId}`);
    }
    return tasks;
  }

  // Get a single task by ID
  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  // Create a new task
  async createTask(createTaskDto: any): Promise<Task> {
    const newTask = new this.taskModel({
      ...createTaskDto,
    });
    return await newTask.save();
  }

  // Update an existing task
  async updateTask(id: string, updateTaskDto: any): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async updateTaskStatus(taskId: string, newStatus: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const userId = task.userId;
    const oldStatus = task.status;
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    this.taskStatisticsModel.findOneAndUpdate(
      { userId, day: today, taskStatus: oldStatus },
      { $inc: { taskCount: -1 } },
      { upsert: true }, // Important: creates the document if it doesn't exist
    );

    // Increment count for the new status
    this.taskStatisticsModel.findOneAndUpdate(
      { userId, day: today, taskStatus: newStatus },
      { $inc: { taskCount: 1 } },
      { upsert: true },
    );

    task.status = newStatus;
    await task.save();

    return task;
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async incrementPomodoroNumber(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.pomodoro_number += 1;

    if (task.pomodoro_number >= task.pomodoro_required_number) {
      task.status = 'completed';
    }

    return task.save();
  }
}
