import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    origin: 'http://localhost:5173', // Allow requests from this origin
    allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning', 'User-Agent', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials (if needed)
  });

  await app.listen(3000); // Ensure this matches your backend's port
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
