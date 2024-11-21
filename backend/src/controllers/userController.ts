import { Request, Response } from 'express';
import User from '../models/User';

// Sample functions
export const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const user = new User({
        username,
        email,
        password,
    });
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};