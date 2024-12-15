import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  async generateAdvice(@Body() body: { input: string }) {
    try {
      const functionCalls = await this.aiService.generateResponse(body.input);
      return { functionCalls };
    } catch (error) {
      return { error: error.message };
    }
  }
}
