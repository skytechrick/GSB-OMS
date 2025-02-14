import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import morganMiddleware from './middlewares/accessHandler.js';
import securityMiddleware from './middlewares/securityMiddleware.js';

dotenv.config();
await connectDB();

const app = express();

app.use(morganMiddleware);
securityMiddleware(app);

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