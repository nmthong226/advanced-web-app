import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  getUsers() {
    return this.usersService.getAllUsers();
  }

  createUser(userData: any) {
    return this.usersService.createUser(userData);
  }

  getUserById(userId: string) {
    return this.usersService.getUserById(userId);
  }

  updateUser(userId: string, updates: any) {
    return this.usersService.updateUser(userId, updates);
  }

  deleteUser(userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
