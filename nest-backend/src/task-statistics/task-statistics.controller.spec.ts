import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatisticsController } from './task-statistics.controller';

describe('TaskStatisticsController', () => {
  let controller: TaskStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStatisticsController],
    }).compile();

    controller = module.get<TaskStatisticsController>(TaskStatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
