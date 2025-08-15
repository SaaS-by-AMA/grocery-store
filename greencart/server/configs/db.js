import mongoose from "mongoose";
import { ensureTTLIndex } from "../models/Order.js";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        
        await mongoose.connect(`${process.env.MONGODB_URI}/grocerystore`);
        
        // Ensure TTL index exists after connection
        await ensureTTLIndex();
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;