// ai-feedbacks.service.ts

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// ai-feedbacks.service.ts
import {
  GoogleGenerativeAI,
  ChatSession,
  GenerativeModel,
  SchemaType,
} from '@google/generative-ai';
import { TasksService } from '../tasks/tasks.service';

//       systemInstruction: `You are an expert on giving feedback to study planning provided by users.
// Users will give you a JSON which has a list of tasks for their study planning.
// Your task is to provide feedback on:
// 1. Whether the study planning is too overwhelming or not.
// 2. If the study planning is not good, provide suggestions. Otherwise, just commend them.
// Remember to give a concise and clear feedback.
// If user does not send tasks, just chat with them`,
//     });

const schema = {
  description:
    'Schema for strengths, improvements, and motivation related to tasks',
  type: SchemaType.OBJECT,
  properties: {
    strengths: {
      type: SchemaType.STRING,
      description:
        'Key accomplishments or positive observations regarding tasks',
      nullable: false,
    },
    improvements: {
      type: SchemaType.STRING,
      description:
        'Areas where the task management system or approach can be enhanced',
      nullable: false,
    },
    motivation: {
      type: SchemaType.STRING,
      description:
        'Suggestions and guidance to keep the team motivated and improve task descriptions',
      nullable: false,
    },
  },
  required: ['strengths', 'improvements', 'motivation'],
};

@Injectable()
export class AiFeedbacksService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private userChatSessions: Map<string, ChatSession> = new Map();

  constructor(
    @Inject(TasksService) private readonly tasksService: TasksService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not defined in environment variables.',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-8b',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        maxOutputTokens: 300,
      },
    });
  }

  /**
   * Analyzes the user's study tasks and provides feedback.
   * @param userId - Unique identifier for the user.
   * @param tasks - Array of task objects.
   * @param user_prompt - User's prompt or message.
   * @returns Feedback string from the AI model.
   */
  async analyzeTasks(
    userId: string,
    tasks: any[],
    user_prompt: string,
  ): Promise<string> {
    try {
      let chatSession = this.userChatSessions.get(userId);

      if (!chatSession) {
        chatSession = this.model.startChat({
          generationConfig: {
            temperature: 0.6,
            topP: 0.8,
            topK: 20,
            maxOutputTokens: 50,
            responseMimeType: 'text/plain',
          },
          history: [],
        });
        this.userChatSessions.set(userId, chatSession);
      }

      const message = `${user_prompt}\n${JSON.stringify(tasks)}`;
      const feedback = await chatSession.sendMessage(message);

      return feedback.response.text();
    } catch (error) {
      console.error('Error in analyzeTasks:', error); // Log the error for debugging
      throw new InternalServerErrorException(
        'Failed to process tasks for analysis.',
      );
    }
  }

  async getSummaryInsights(): Promise<string | { message: string }> {
    try {
      const tasks = await this.tasksService.findAll();
      if (!tasks || tasks.length === 0) {
        return { message: 'No tasks found to analyze' };
      }

      const prompt = `Analyze the following tasks and provide a summary with strengths, areas for improvement, and motivational messages. Format the output as a JSON object with the keys "strengths", "improvements", and "motivation".
Tasks:
\`\`\`json
${JSON.stringify(tasks, null, 2)}
\`\`\``;

      const result = await this.model.generateContent(prompt);
      const textResponse = result.response.text();
      console.log(textResponse);
      return textResponse;
    } catch (error) {
      console.error('Error in getSummaryInsights:', error); // Log the error
      throw new InternalServerErrorException(
        'Failed to generate summary insights.',
      );
    }
  }
}
