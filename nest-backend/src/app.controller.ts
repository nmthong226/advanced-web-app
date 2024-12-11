import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  getAllUsers() {
    return this.appService.getUsers();
  }

  @Post('users')
  createUser(@Body() userData: any) {
    return this.appService.createUser(userData);
  }

  @Get('users/:id')
  getUserById(@Param('id') userId: string) {
    return this.appService.getUserById(userId);
  }

  @Patch('users/:id')
  updateUser(@Param('id') userId: string, @Body() updates: any) {
    return this.appService.updateUser(userId, updates);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') userId: string) {
    return this.appService.deleteUser(userId);
  }
}
