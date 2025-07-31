import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import jwt from 'jsonwebtoken';
const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', '']

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Test route to verify JWT token
app.get('/test-token', (req, res) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZ2hhemlAZ21haWwuY29tIiwiaWF0IjoxNzUzOTg1OTk2LCJleHAiOjE3NTQ1OTA3OTZ9.U-vK3R1uaCFTk6CsWicb-O1nN3Kvyv_xWIW9Bs800hg';
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      secretUsed: process.env.JWT_SECRET,
      token
    });
  }
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})