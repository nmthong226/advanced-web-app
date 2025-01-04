import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { UsersModule } from '../users/users.module'; // Import UsersModule for UsersService

@Module({
  imports: [UsersModule], // Use UsersService from UsersModule
  controllers: [WebhooksController], // Handle webhook-related routes
  providers: [WebhooksService], // Provide WebhooksService
})
export class WebhooksModule {}
