import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { SessionSettingsService } from './session-settings.service';
import { CurrentPomodoroService } from './current-pomodoro.service';
import { TasksService } from '../tasks/tasks.service';
import { PomodoroLogService } from './pomodoro-log.service';

@Controller('focus-sessions')
export class FocusSessionsController {
  constructor(
    private readonly sessionSettingsService: SessionSettingsService,
    private readonly currentPomodoroService: CurrentPomodoroService,
    private readonly pomodoroLogService: PomodoroLogService,
    private readonly taskService: TasksService,
  ) {}

  @Post('session-settings')
  async createSessionSettings(@Body() body) {
    const {
      user_id,
      default_work_time,
      default_break_time,
      long_break_time,
      cycles_per_set,
    } = body;
    return this.sessionSettingsService.createSessionSettings(user_id, {
      default_work_time,
      default_break_time,
      long_break_time,
      cycles_per_set,
    });
  }

  @Put('update/:user_id')
  async updateSessionSettings(@Param('user_id') user_id: string, @Body() body) {
    const {
      default_work_time,
      default_break_time,
      long_break_time,
      cycles_per_set,
    } = body;
    return this.sessionSettingsService.updateSessionSettings(user_id, {
      default_work_time,
      default_break_time,
      long_break_time,
      cycles_per_set,
    });
  }

  

  @Get('session-settings')
  async findAllSessionSettings() {
    return this.sessionSettingsService.findAllSessionSettings();
  }

  // Pomodoro log
  @Post('pomodoro-log')
  async createPomodoroLog(@Body() body) {
    let {
      user_id,
      task_id,
      current_pomodoro_number,
      current_cycle_number,
      required_cyle_number,
      start_time,
      end_time,
      session_status,
    } = body;

    // create pomodoro log
    await this.pomodoroLogService.create({
      user_id,
      task_id,
      start_time,
      end_time,
      session_status,
    });
    if (session_status == 'pomodoro') {
      // Update pomodoro_number and check status in Task table
      await this.taskService.incrementPomodoroNumber(task_id);
      if (current_pomodoro_number == required_cyle_number) {
        session_status = 'long-break';
      } else {
        session_status = 'short-break';
      }
    } else if (session_status == 'short-break') {
      session_status = 'short-break';
      current_cycle_number += 1;
    } else if (session_status == 'long-break') {
      session_status = 'pomodoro';
      current_cycle_number = 1;
    }
    current_pomodoro_number += 1;
    // update CurrentPomodoro
    const currentPomodoro =
      await this.currentPomodoroService.findCurrentPomodoroByUserId(user_id);
    currentPomodoro.current_pomodoro_number = current_pomodoro_number;
    currentPomodoro.current_cycle_number = current_cycle_number;
    currentPomodoro.current_session_status = session_status;
    await currentPomodoro.save();
    return {
      user_id,
      task_id,
      current_pomodoro_number,
      current_cycle_number,
      required_cyle_number,
      start_time,
      end_time,
      session_status,
      message: 'successfully',
    };
  }

  // CurrentPomodoro
  @Post('/current-pomodoro')
  async createCurrentPomodoro(@Body() data) {
    return this.currentPomodoroService.createCurrentPomodoro(data);
  }

  @Get('/pomodoro-log')
  async getPomodoroLog() {
    return this.pomodoroLogService.findAll();
  }
}
