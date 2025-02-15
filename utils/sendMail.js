import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { parse } from 'path';
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

export const sendMail = async (mailOptions) => {
    try{
        let info = await transporter.sendMail(mailOptions);
        return info? info : false;
    }catch (e){
        return false;
    };
};
