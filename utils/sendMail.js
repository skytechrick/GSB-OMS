import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.NO_REPLY_HOST,
    port: process.env.NO_REPLY_PORT,
    secure: process.env.NO_REPLY_PORT === 465? true : false,
    auth: {
        user: process.env.NO_REPLY_MAIL_ID,
        pass: process.env.NO_REPLY_MAIL_PASSWORD,
    }
});

export const sendMail = async (mailOptions) => {
    try{
        let info = await transporter.sendMail(mailOptions);
        return info? info : false;
    }catch (e){
        return false;
    };
};
