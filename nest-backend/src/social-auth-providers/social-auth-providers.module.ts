import { Module } from '@nestjs/common';
import { SocialAuthProvidersController } from './social-auth-providers.controller';
import { SocialAuthProvidersService } from './social-auth-providers.service';

@Module({
  controllers: [SocialAuthProvidersController],
  providers: [SocialAuthProvidersService]
})
export class SocialAuthProvidersModule {}
