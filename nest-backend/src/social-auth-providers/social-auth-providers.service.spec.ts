import { Test, TestingModule } from '@nestjs/testing';
import { SocialAuthProvidersService } from './social-auth-providers.service';

describe('SocialAuthProvidersService', () => {
  let service: SocialAuthProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialAuthProvidersService],
    }).compile();

    service = module.get<SocialAuthProvidersService>(SocialAuthProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
