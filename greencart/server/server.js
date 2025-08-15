import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 4000;

// Database and Cloudinary connection
await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://alghani.store'];

// Middleware configuration
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true 
}));

// Basic routes
app.get('/', (req, res) => res.send("API is Working"));

// API endpoints
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/seller', sellerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});