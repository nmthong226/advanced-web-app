import { Module } from '@nestjs/common';
import { FocusSessionsController } from './focus-sessions.controller';
import { FocusSessionsService } from './focus-sessions.service';

@Module({
  controllers: [FocusSessionsController],
  providers: [FocusSessionsService]
})
export class FocusSessionsModule {}
