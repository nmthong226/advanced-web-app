import { Test, TestingModule } from '@nestjs/testing';
import { SocialAuthProvidersController } from './social-auth-providers.controller';

describe('SocialAuthProvidersController', () => {
  let controller: SocialAuthProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialAuthProvidersController],
    }).compile();

    controller = module.get<SocialAuthProvidersController>(SocialAuthProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
