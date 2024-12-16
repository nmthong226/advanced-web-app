import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatisticsService } from './task-statistics.service';

describe('TaskStatisticsService', () => {
  let service: TaskStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskStatisticsService],
    }).compile();

    service = module.get<TaskStatisticsService>(TaskStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
