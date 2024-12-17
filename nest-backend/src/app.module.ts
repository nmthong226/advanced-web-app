import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AiFeedbacksModule } from './ai-feedbacks/ai-feedbacks.module';
import { SocialAuthProvidersModule } from './social-auth-providers/social-auth-providers.module';
import { FocusSessionsModule } from './focus-sessions/focus-sessions.module';
import { TaskSchedulesModule } from './task-schedules/task-schedules.module';
import { TaskStatisticsModule } from './task-statistics/task-statistics.module';
import { DailyAnalyticsModule } from './daily-analytics/daily-analytics.module';
import { ActivityModule } from './activity/activity.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [UsersModule, TasksModule, AiFeedbacksModule, SocialAuthProvidersModule, FocusSessionsModule, TaskSchedulesModule, TaskStatisticsModule, DailyAnalyticsModule, ActivityModule,
  ConfigModule.forRoot({
    isGlobal: true, // Make ConfigModule available globally
    envFilePath: '.env', // Specify the .env file path
  }),


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
