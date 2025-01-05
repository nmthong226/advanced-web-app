// src/app.module.ts

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Import your existing modules
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

// Import the AuthMiddleware
import { AuthMiddleware } from './auth/auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        // Add any other public routes you want to exclude
      )
      .forRoutes('ai-feedbacks]'); // Apply to all routes except excluded
  }
}
