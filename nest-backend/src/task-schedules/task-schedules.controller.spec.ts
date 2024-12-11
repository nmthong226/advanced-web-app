import { Test, TestingModule } from '@nestjs/testing';
import { TaskSchedulesController } from './task-schedules.controller';

describe('TaskSchedulesController', () => {
  let controller: TaskSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskSchedulesController],
    }).compile();

    controller = module.get<TaskSchedulesController>(TaskSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
