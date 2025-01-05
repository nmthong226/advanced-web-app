import { Controller, Get } from '@nestjs/common';
import { DailyAnalyticsService } from './daily-analytics.service';

@Controller('daily-analytics')
export class DailyAnalyticsController {
  constructor(private readonly dailyAnalyticsService: DailyAnalyticsService) {}

  @Get('/circle-chart')
  async getCircleChart() {
    return await this.dailyAnalyticsService.getCircleChartGroupByTaskStaus();
  }

  @Get('/weekly')
  async getWeeklyAnalytics() {
    return await this.dailyAnalyticsService.getWeeklyTaskCounts();
  }

  @Get('/pomodoro-analytics') 
  async getPomodoroAnalytics() {
    return await this.dailyAnalyticsService.getPomodoroAnalytics(); 
  }
}

