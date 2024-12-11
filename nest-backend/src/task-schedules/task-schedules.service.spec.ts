import { Test, TestingModule } from '@nestjs/testing';
import { TaskSchedulesService } from './task-schedules.service';

describe('TaskSchedulesService', () => {
  let service: TaskSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskSchedulesService],
    }).compile();

    service = module.get<TaskSchedulesService>(TaskSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
