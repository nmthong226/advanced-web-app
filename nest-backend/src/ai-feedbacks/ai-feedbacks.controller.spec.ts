import { Test, TestingModule } from '@nestjs/testing';
import { AiFeedbacksController } from './ai-feedbacks.controller';

describe('AiFeedbacksController', () => {
  let controller: AiFeedbacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiFeedbacksController],
    }).compile();

    controller = module.get<AiFeedbacksController>(AiFeedbacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
