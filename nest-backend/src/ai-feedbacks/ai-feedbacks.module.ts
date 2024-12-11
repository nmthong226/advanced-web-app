import { Module } from '@nestjs/common';
import { AiFeedbacksController } from './ai-feedbacks.controller';
import { AiFeedbacksService } from './ai-feedbacks.service';

@Module({
  controllers: [AiFeedbacksController],
  providers: [AiFeedbacksService]
})
export class AiFeedbacksModule {}
