import { Test, TestingModule } from '@nestjs/testing';
import { FocusSessionsController } from './focus-sessions.controller';

describe('FocusSessionsController', () => {
  let controller: FocusSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocusSessionsController],
    }).compile();

    controller = module.get<FocusSessionsController>(FocusSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
