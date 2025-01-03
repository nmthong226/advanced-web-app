import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.raw({ type: 'application/json' }));
  // Enable CORS
  app.enableCors();

  await app.listen(3000);
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
