import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import marriageRoutes from './routes/marriageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/marriage', marriageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storyRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));