import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';
import { TaskStatistics } from '../task-statistics/task-statistics.schema';
import { faker } from '@faker-js/faker';


@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskStatistics.name)
    private taskStatisticsModel: Model<TaskStatistics>,
  ) {}

  async generateMockTasks(count: number = 10) {
    const mockTasks: Partial<Task>[] = [];
    for (let i = 0; i < count; i++) {
        const statusOptions = ['pending', 'in-progress', 'completed', 'expired'];
        const priorityOptions = ['low', 'medium', 'high'];
      mockTasks.push({
        id: faker.string.uuid(), // Generate unique IDs
        userId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: statusOptions[Math.floor(Math.random()*statusOptions.length)],
        priority: priorityOptions[Math.floor(Math.random()*priorityOptions.length)],
        category: faker.word.noun(),
        startTime: faker.date.past(),
        endTime: faker.date.future(),
        dueTime: faker.date.future(),
        estimatedTime: faker.number.int({ min: 15, max: 120 }), // Random time in minutes
        pomodoro_number: faker.number.int({ min: 0, max: 5 }),
        pomodoro_required_number: faker.number.int({ min: 1, max: 10 }),
        is_on_calendar: faker.datatype.boolean(),
        is_on_pomodoro_list: faker.datatype.boolean(),
        style: {
            backgroundColor: faker.color.rgb(),
            textColor: faker.color.rgb()
        }
      });
    }

    try {
      await this.taskModel.insertMany(mockTasks);
      console.log(`${count} mock tasks inserted successfully.`);
    } catch (error) {
      console.error('Error inserting mock tasks:', error);
    }
  }

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
