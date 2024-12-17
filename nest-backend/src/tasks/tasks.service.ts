import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { Task } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    // Tasks for USER-1234
    {
      id: 'TASK-8782',
      userId: 'USER-1234',
      title: "Co len bro",
      status: 'in-progress',
      label: 'documentation',
      priority: 'medium',
      description: 'This task involves optimizing the SSD compression method.',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      dueTime: '2024-02-01',
      estimatedTime: 40,
    },
    {
      id: 'TASK-7878',
      userId: 'USER-1234',
      title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
      status: 'pending',
      label: 'documentation',
      priority: 'medium',
      description: 'Work on indexing the EXE feed with multi-byte pixel support.',
      startDate: '2024-02-01',
      endDate: '2024-02-10',
      dueTime: '2024-02-10',
      estimatedTime: 30,
    },
    {
      id: 'TASK-1280',
      userId: 'USER-1234',
      title: 'Use the digital TLS panel, then you can transmit the haptic system!',
      status: 'completed',
      label: 'bug',
      priority: 'high',
      description: 'Resolved bug related to digital TLS panel and haptic system transmission.',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      dueTime: '2024-01-12',
      estimatedTime: 10,
    },
    {
      id: 'TASK-7262',
      userId: 'USER-1234',
      title: 'The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!',
      status: 'pending',
      label: 'feature',
      priority: 'high',
      description: 'Fix UTF8 application down by parsing neural bandwidth for firewall support.',
      startDate: '2024-01-05',
      endDate: '2024-01-08',
      dueTime: '2024-01-08',
      estimatedTime: 35,
    },
    {
      id: 'TASK-7184',
      userId: 'USER-1234',
      title: 'We need to program the back-end THX pixel!',
      status: 'pending',
      label: 'feature',
      priority: 'low',
      description: 'Back-end programming for THX pixel required.',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      dueTime: '2024-02-15',
      estimatedTime: 20,
    },
  
    // Tasks for USER-5678
    {
      id: 'TASK-7839',
      userId: 'USER-5678',
      title: 'We need to bypass the neural TCP card!',
      status: 'pending',
      label: 'bug',
      priority: 'high',
      description: 'Fix the issue with the neural TCP card communication.',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      dueTime: '2024-01-20',
      estimatedTime: 20,
    },
    {
      id: 'TASK-5562',
      userId: 'USER-5678',
      title: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!',
      status: 'pending',
      label: 'feature',
      priority: 'medium',
      description: 'Resolve issues with the SAS interface to ensure proper PNG bandwidth backup.',
      startDate: '2024-02-05',
      endDate: '2024-02-15',
      dueTime: '2024-02-15',
      estimatedTime: 25,
    },
    {
      id: 'TASK-8686',
      userId: 'USER-5678',
      title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: 'completed',
      label: 'feature',
      priority: 'medium',
      description: 'Attempted parsing of SSL protocols for API integration, but canceled due to incompatibility.',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      dueTime: '2024-01-10',
      estimatedTime: 15,
    },
    {
      id: 'TASK-1138',
      userId: 'USER-5678',
      title: "Generating the driver won't do anything, we need to quantify the 1080p SMTP bandwidth!",
      status: 'in-progress',
      label: 'feature',
      priority: 'medium',
      description: 'Currently quantifying 1080p SMTP bandwidth for driver development.',
      startDate: '2024-01-20',
      endDate: '2024-02-01',
      dueTime: '2024-02-01',
      estimatedTime: 50,
    },
    {
      id: 'TASK-5160',
      userId: 'USER-5678',
      title: "Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!",
      status: 'in-progress',
      label: 'documentation',
      priority: 'high',
      description: 'Working on the back-end JSON protocol navigation and data handling.',
      startDate: '2024-01-18',
      endDate: '2024-02-05',
      dueTime: '2024-02-05',
      estimatedTime: 45,
    },
  ];
  

  findAll(): Task[] {
    return this.tasks;
  }

  findByUserId(userId: string): Task[] {
    const userTasks = this.tasks.filter((task) => task.userId === userId);
    if (!userTasks.length) {
      throw new NotFoundException(`No tasks found for user ID ${userId}`);
    }
    return userTasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      ...createTaskDto,
      id: `TASK-${Date.now()}`, // Generate unique ID
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updateTaskDto };
    return this.tasks[taskIndex];
  }

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }
}
