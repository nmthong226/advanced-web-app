import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI), // Ensure DB connection
    UsersModule, // Import UsersModule
    TasksModule, // Import TasksModule
  ],
  providers: [SeedService],
})
export class SeedModule {}
