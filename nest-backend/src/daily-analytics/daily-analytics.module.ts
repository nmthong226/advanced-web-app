import { Module } from '@nestjs/common';
import { DailyAnalyticsController } from './daily-analytics.controller';
import { DailyAnalyticsService } from './daily-analytics.service';

@Module({
  controllers: [DailyAnalyticsController],
  providers: [DailyAnalyticsService]
})
export class DailyAnalyticsModule {}
