import { Module } from '@nestjs/common';
import { TaskStatisticsController } from './task-statistics.controller';
import { TaskStatisticsService } from './task-statistics.service';

@Module({
  controllers: [TaskStatisticsController],
  providers: [TaskStatisticsService],
})
export class TaskStatisticsModule {}
