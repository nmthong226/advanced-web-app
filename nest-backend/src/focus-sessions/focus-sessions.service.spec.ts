import { Test, TestingModule } from '@nestjs/testing';
import { FocusSessionsService } from './focus-sessions.service';

describe('FocusSessionsService', () => {
  let service: FocusSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocusSessionsService],
    }).compile();

    service = module.get<FocusSessionsService>(FocusSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
