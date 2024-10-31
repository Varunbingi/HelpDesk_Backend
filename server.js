import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DatabaseConnection from './config/DatabaseConnection.js';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'

dotenv.config();
DatabaseConnection();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
  }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
