import { Module } from '@nestjs/common';
import { DailyAnalyticsController } from './daily-analytics.controller';
import { DailyAnalyticsService } from './daily-analytics.service';
import { TasksModule } from '../tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PomodoroLogSchema } from '../focus-sessions/pomodoro.schema';

@Module({
  controllers: [DailyAnalyticsController],
  providers: [DailyAnalyticsService],
  imports: [
    MongooseModule.forFeature([
      { name: 'PomodoroLog', schema: PomodoroLogSchema },
    ]),
    TasksModule],
})
export class DailyAnalyticsModule {}
