// ai-feedbacks.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, ChatSession, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiFeedbacksService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  
  private userChatSessions: Map<string, ChatSession> = new Map();
  
  constructor() {
    const apiKey = "AIzaSyBF2CAgrYu_pE02VtTPr8Blpddl3lk8sbQ";
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      systemInstruction: `You are an expert on giving feedback to study planning provided by users. 
Users will give you a JSON which has a list of tasks for their study planning.
Your task is to analyze this study planning and provide feedback on:
1. Whether the study planning is too overwhelming or not.
2. If the study planning is not good, provide suggestions. Otherwise, just commend them.
Remember to give a concise and clear feedback.`,
    });
  }

  /**
   * Analyzes the user's study tasks and provides feedback.
   * @param userId - Unique identifier for the user.
   * @param tasks - Array of task objects.
   * @param user_prompt - User's prompt or message.
   * @returns Feedback string from the AI model.
   */
  async analyzeTasks(userId: string, tasks: any[], user_prompt: string): Promise<string> {
    try {
      let chatSession = this.userChatSessions.get(userId);

      if (!chatSession) {
        chatSession = this.model.startChat({
          generationConfig: {
            temperature: 0.5,
            topP: 0.8,
            topK: 1, 
            maxOutputTokens: 50,
            responseMimeType: "text/plain",
          },
          history: [],
        });
        this.userChatSessions.set(userId, chatSession);
      }
      const message = `${user_prompt}\n${JSON.stringify(tasks)}`;
      const feedback = await chatSession.sendMessage(message);

      return feedback.response.text();
    } catch (error) {
      throw new InternalServerErrorException('Failed to process tasks for analysis.');
    }
  }
}
