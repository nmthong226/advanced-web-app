import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseProvider } from './database.provider';

@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService, private readonly dbProvider: DatabaseProvider) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('test-db')
  async testConnection() {
    const db = await this.dbProvider.connect();
    const collections = await db.listCollections().toArray();
    return {
      message: 'Successfully connected to MongoDB!',
      collections: collections.map((col) => col.name),
    };
  }
}
