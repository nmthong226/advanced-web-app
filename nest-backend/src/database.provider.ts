// src/database.providers.ts
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseProvider implements OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private readonly logger = new Logger(DatabaseProvider.name);

  constructor() {
    const uri = process.env.DB_URI;
    if (!uri) {
      this.logger.error("❌ MongoDB URI is undefined. Please check if 'DB_URL' is set in .env file.");
      process.exit(1);
    }
    this.client = new MongoClient(uri);
  }

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME || 'test'); // Use DB_NAME from .env or default to 'test'
      this.logger.log('✅ Successfully connected to MongoDB!');
    }
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('⚠️ MongoDB connection closed');
  }

  getDb(): Db {
    return this.db;
  }
}