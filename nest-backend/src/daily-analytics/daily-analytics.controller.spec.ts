import { Test, TestingModule } from '@nestjs/testing';
import { DailyAnalyticsController } from './daily-analytics.controller';

describe('DailyAnalyticsController', () => {
  let controller: DailyAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyAnalyticsController],
    }).compile();

    controller = module.get<DailyAnalyticsController>(DailyAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
