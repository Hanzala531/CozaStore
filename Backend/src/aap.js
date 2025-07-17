import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routers
import productRouter from "./routes/product.routes.js";
import userRouter from './routes/user.routes.js';
import categoryRouter from './routes/category.routes.js';
import orderRouter from './routes/order.routes.js';
import cartRouter from './routes/cart.routes.js';
import newsLetterRouter from './routes/newsLetter.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: "30kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Commented out for Vercel deployment
app.use(cookieparser());

// Basic route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Coza Store API is running!",
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/newsletter", newsLetterRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

export { app };