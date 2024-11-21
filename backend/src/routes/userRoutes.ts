import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// Route to create a new user
router.post('/', userController.createUser);

// Route to get all users
router.get('/', userController.getUsers);
 
export default router;