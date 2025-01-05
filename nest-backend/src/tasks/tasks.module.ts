import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks.schema';
import {
  TaskStatistics,
  TaskStatisticsSchema,
} from '../task-statistics/task-statistics.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: TaskStatistics.name, schema: TaskStatisticsSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [MongooseModule, TasksService],
})
export class TasksModule {}
