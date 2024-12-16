import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow credentials (if needed)
  });

  await app.listen(3000); // Ensure this matches your backend's port
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
