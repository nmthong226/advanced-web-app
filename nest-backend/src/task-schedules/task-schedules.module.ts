import { Module } from '@nestjs/common';
import { TaskSchedulesController } from './task-schedules.controller';
import { TaskSchedulesService } from './task-schedules.service';

@Module({
  controllers: [TaskSchedulesController],
  providers: [TaskSchedulesService]
})
export class TaskSchedulesModule {}
