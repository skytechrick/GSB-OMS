import crypto from 'crypto';
import admin from '../../models/admin.js';
import { loginSchema } from '../../utils/zodSchema.js';
import { hashPassword , comparePassword } from '../../utils/passwordHandler.js';
import { sendMail } from '../../utils/sendMail.js';
import { generateToken } from '../../utils/jwtHandler.js';

export const login = async ( req , res , next ) => {
    try {
        const validData = loginSchema.safeParse(req.body);
        if (!validData.success) {
            return res.status(400).json({
                status: 'error',
                message: "Unauthorized access.",
            });
        };

        const { password } = validData.data;
        const email = validData.data.email.toLowerCase();

        const token = crypto.randomBytes(32).toString("hex");
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = Date.now() + 300000;

        let adminData = await admin.findOne({
            email: email,
        });

        if (!adminData) {
            
            if(email !== process.env.ADMIN_EMAIL){
                return res.status(400).json({
                    status: 'error',
                    message: "Unauthorized access.",
                });
            };
            if(req.body.password !== process.env.ADMIN_PASSWORD){
                return res.status(401).json({
                    status: 'failed',
                    message: "Invalid password."
                });
            };
        
            const newPassword = await hashPassword(validData.data.password);
            const newAdmin = await admin({
                email,
                password: newPassword,
                personalDetails: {
                    firstName: "Rick",
                    lastName: "Sarkar",
                },
                authentication:{
                    otp,
                    otpExpiry,
                    token,
                },
            });
            
            await newAdmin.save();
            adminData = newAdmin;
        }else{
            if(adminData.isBan){
                return res.status(400).json({
                    status: 'error',
                    message: "Your account has been banned.",
                    reason: adminData.banReason,
                });
            };
            const isCorrect = await comparePassword(password , adminData.password);
            if (!isCorrect) {
                return res.status(400).json({
                    status: 'failed',
                    message: "Incorrect password."
                });
            };
        };

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.NO_REPLY_MAIL_ID}>`,
            to: email,
            subject: "Admin Login | Notification",
            html: `<h1>Admin login OTP: ${otp}</h1>${Date().toLocaleString("en-IN")}`,
        });

        if(!isMailSent){
            return res.status(400).json({
                status: 'error',
                message: "Unable to send OTP."
            });
        };

        adminData.authentication.otp = otp;
        adminData.authentication.otpExpiry = otpExpiry;
        adminData.authentication.token = token;
        await adminData.save();

        const jwtToken = generateToken({
            id: adminData._id,
            token,
            createdAt: Date.now(),
        });

        if(req.isWeb){
            return res.status(201).cookie("adminOtp" , jwtToken , {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 5,
                signed: true,
            }).json({
                status: 'success',
                message: "OTP sent to your email."
            });
        };

        return res.status(201).json({
            status: 'success',
            message: "OTP sent to your email.",
            token: "Bearer "+jwtToken,
        });
        
    } catch (error) {
        next(error);
    };
};

export const loginVerifyOtp = async ( req , res , next ) => {
    try {

        return res.status(200).json({
            status: 'success',
            message: 'Login successfully',
        });

    } catch (error) {
        next(error);
    };
};