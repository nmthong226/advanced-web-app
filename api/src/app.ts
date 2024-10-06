import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser'; // Import body-parser
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import connectDB from './db';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// App routes
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({"message": "Hello World"});
})
app.use('/api/users', userRoutes);

export default app;