import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai/ai.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env vars globally
  ],
  controllers: [AppController, AiController],
  providers: [AppService, AiService],
})
export class AppModule {}
