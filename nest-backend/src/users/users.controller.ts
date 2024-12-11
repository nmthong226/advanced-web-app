import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() userData: any) {
    return this.usersService.createUser(userData);
  }

  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() updates: any) {
    return this.usersService.updateUser(userId, updates);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
