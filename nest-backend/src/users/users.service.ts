import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      userId: '1',
      email: 'user1@example.com',
      passwordHash: 'hashedpassword1',
      fullName: 'User One',
      profilePictureUrl: 'https://example.com/user1.jpg',
    },
    {
      userId: '2',
      email: 'user2@example.com',
      passwordHash: 'hashedpassword2',
      fullName: 'User Two',
      profilePictureUrl: 'https://example.com/user2.jpg',
    },
  ];

  getAllUsers() {
    return this.users;
  }

  getUserById(userId: string) {
    return this.users.find(user => user.userId === userId);
  }

  createUser(data: any) {
    const newUser = { userId: Date.now().toString(), ...data };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId: string, updates: Partial<any>) {
    const user = this.users.find(user => user.userId === userId);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  deleteUser(userId: string) {
    const index = this.users.findIndex(user => user.userId === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return { message: 'User deleted successfully' };
    }
    return null;
  }
}
