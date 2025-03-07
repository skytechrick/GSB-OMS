import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.NO_REPLY_HOST,
    port: parseInt(process.env.NO_REPLY_PORT , 10),
    secure: parseInt(process.env.NO_REPLY_PORT , 10) === 465,
    auth: {
        user: process.env.NO_REPLY_MAIL_ID,
        pass: process.env.NO_REPLY_MAIL_PASSWORD,
    },
    debug: false,   // console print
    logger: false,  // console print
    connectionTimeout: 6000,
});

transporter.verify((error) => {
    if(error) {
        console.log("Error in transporter: ", error);
    } else {
        console.log("No-Reply - Connected to mail server!");
    };
});

export default transporter;