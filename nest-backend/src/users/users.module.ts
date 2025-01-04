import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { WebhooksService } from '../webhooks/webhooks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Import User schema
  ],
  controllers: [UsersController], // Only UsersController
  providers: [UsersService, WebhooksService], // Provide services
  exports: [UsersService, MongooseModule], // Export services and MongooseModule for reuse
})
export class UsersModule {}
