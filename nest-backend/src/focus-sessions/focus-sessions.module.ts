import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FocusSessionsController } from './focus-sessions.controller';
import { FocusSessionsService } from './focus-sessions.service';
import { SessionSettingsService } from './session-settings.service';
import {
  CurrentPomodoroSchema,
  PomodoroDetailsSchema,
  PomodoroLogSchema,
  SessionSettingsSchema,
} from './pomodoro.schema';
import { PomodoroDetailsService } from './pomodoro-details.service';
import { CurrentPomodoroService } from './current-pomodoro.service';
import { TasksModule } from '../tasks/tasks.module';
import { PomodoroLogService } from './pomodoro-log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SessionSettings', schema: SessionSettingsSchema },
      { name: 'PomodoroDetails', schema: PomodoroDetailsSchema },
      { name: 'CurrentPomodoro', schema: CurrentPomodoroSchema },
      { name: 'PomodoroLog', schema: PomodoroLogSchema },
    ]),
    TasksModule,
  ],
  controllers: [FocusSessionsController],
  providers: [
    FocusSessionsService,
    SessionSettingsService,
    PomodoroDetailsService,
    CurrentPomodoroService,
    PomodoroLogService,
  ],
})
export class FocusSessionsModule {}
