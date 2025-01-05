import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import Modules
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AiFeedbacksModule } from './ai-feedbacks/ai-feedbacks.module';
import { SocialAuthProvidersModule } from './social-auth-providers/social-auth-providers.module';
import { FocusSessionsModule } from './focus-sessions/focus-sessions.module';
import { TaskSchedulesModule } from './task-schedules/task-schedules.module';
import { TaskStatisticsModule } from './task-statistics/task-statistics.module';
import { DailyAnalyticsModule } from './daily-analytics/daily-analytics.module';
import { ActivityModule } from './activity/activity.module';
import { SeedModule } from './seed/seed.module';

// Database & Config
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [
    // Load .env configuration globally
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule available globally
      envFilePath: '.env', // Path to .env file
    }),

    // Connect to MongoDB (ensure DB_URI is set in .env)
    MongooseModule.forRoot(process.env.DB_URI),

    // Other modules
    UsersModule,
    TasksModule,
    AiFeedbacksModule,
    SocialAuthProvidersModule,
    FocusSessionsModule,
    TaskSchedulesModule,
    TaskStatisticsModule,
    DailyAnalyticsModule,
    ActivityModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseProvider],
})
export class AppModule {}
