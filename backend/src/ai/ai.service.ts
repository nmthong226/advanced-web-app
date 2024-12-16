import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: any;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [
        {
          functionDeclarations: [
            {
              name: 'give_advice_to_teenager',
              description: 'Giving appropriate advice for teenagers as an old wise man.',
              parameters: {
                type: 'object',
                properties: {
                  advice: {
                    type: 'string',
                    description: 'An advice as an old wise man.',
                  },
                },
                required: ['advice'],
              },
            },
          ],
        },
      ],
      toolConfig: { functionCallingConfig: { mode: 'ANY' } },
    });
  }

  async generateResponse(input: string): Promise<string[]> {
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };

    // Start the chat session
    const chatSession = this.model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(input);

    const functionCalls: string[] = [];
    for (const candidate of result.response.candidates) {
      for (const part of candidate.content.parts) {
        if (part.functionCall) {
          const items = part.functionCall.args;
          const args = Object.keys(items)
            .map((key) => `${key}: ${items[key]}`)
            .join(', ');
          functionCalls.push(`${part.functionCall.name}(${args})`);
        }
      }
    }

    return functionCalls;
  }
}
