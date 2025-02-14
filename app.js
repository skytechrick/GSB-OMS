import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import morganMiddleware from './middlewares/accessHandler.js';

dotenv.config();
await connectDB();

const app = express();

app.use(morganMiddleware);
app.use(cors({
    origin: [
        "http://localhost",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"], 
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        }
    },
    frameguard: { action: "deny" },
    hsts: process.env.NODE_ENV === "production" ? { 
        maxAge: 31536000, 
        includeSubDomains: true, 
        preload: true 
    } : false,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    referrerPolicy: { policy: "no-referrer" }
}));

app.get('/', ( req , res , next ) => {
    try {
        return res.status(200).send({
            status: 'success',
            message: 'Server is running successfully',
        });
    } catch (error) {
        next(error);
    };
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});