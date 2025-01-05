import { Module } from '@nestjs/common';
import { AiFeedbacksController } from './ai-feedbacks.controller';
import { AiFeedbacksService } from './ai-feedbacks.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [AiFeedbacksController],
  providers: [AiFeedbacksService],
  imports: [TasksModule],
})
export class AiFeedbacksModule {}
