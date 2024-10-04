// services/userService.ts
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

// Fetch a list of users
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

// Fetch a single user by ID
export const getUserById = async (id: number): Promise<User> => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching user with ID ${id}`);
    }
};