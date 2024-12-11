import { Test, TestingModule } from '@nestjs/testing';
import { DailyAnalyticsService } from './daily-analytics.service';

describe('DailyAnalyticsService', () => {
  let service: DailyAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyAnalyticsService],
    }).compile();

    service = module.get<DailyAnalyticsService>(DailyAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
