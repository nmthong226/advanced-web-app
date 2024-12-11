import { Test, TestingModule } from '@nestjs/testing';
import { AiFeedbacksService } from './ai-feedbacks.service';

describe('AiFeedbacksService', () => {
  let service: AiFeedbacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiFeedbacksService],
    }).compile();

    service = module.get<AiFeedbacksService>(AiFeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
