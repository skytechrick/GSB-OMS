import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const app = express();

app.get('/', (req, res) => {
    return res.status(200).send({
        status: 'success',
        message: 'Server is running successfully',
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});