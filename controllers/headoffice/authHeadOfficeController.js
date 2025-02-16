import crypto from 'crypto';
import admin from '../../models/admin.js';
import { loginSchema } from '../../utils/zodSchema.js';
import { hashPassword , comparePassword } from '../../utils/passwordHandler.js';
import { sendMail } from '../../utils/sendMail.js';
import { generateToken , verifyToken } from '../../utils/jwtHandler.js';

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
                adminData.loggedIn.loginAttempts++;
                await adminData.save();
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
        
        const isWeb = req.isWeb;
        
        if (isWeb) {

            if (!req.signedCookies.adminOtp) {
                return res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            };
            req.token = req.signedCookies.adminOtp;

        }else{
            if (!req.headers.authorization) {
                console.log("A");
                return res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            };

            const token = req.headers.authorization.split(' ')[1];

            req.token = token;
        };

        const decoded = verifyToken(req.token);
        if (!decoded) {
            if(isWeb){
                return res.status(401).clearCookie("adminOtp").send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            }
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        };

        const otp = req.body.otp;
        if(!otp){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP',
            });
        };

        if(otp.length !== 6){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP',
            });
        };

        const adminData = await admin.findById(decoded.id);

        if (!adminData) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        };

        if(adminData.authentication.token !== decoded.token){
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        };

        if (adminData.authentication.otp !== parseInt(otp, 10)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP',
            });
        };

        if (adminData.authentication.otpExpiry < Date.now()) {
            return res.status(400).json({
                status: 'error',
                message: 'OTP expired',
            });
        };

        const newToken = crypto.randomBytes(57).toString("hex");
        adminData.authentication.otp = null;
        adminData.authentication.otpExpiry = null;
        adminData.authentication.token = null;
        adminData.loggedIn.token = newToken;
        adminData.loggedIn.lastLoggedIn = Date.now();
        adminData.loggedIn.loginAttempts = 0;
        adminData.isVerified = true;

        await adminData.save();

        const jwtNewToken = generateToken({
            id: adminData._id,
            token: newToken,
            createdAt: Date.now(),
        });

        if(isWeb){
            return res.status(200).clearCookie("adminOtp").cookie("admin" , jwtNewToken , {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                signed: true,
            }).json({
                status: 'success',
                message: 'Login successfully',
            });
        };

        return res.status(200).json({
            status: 'success',
            message: 'Login successfully',
            token: "Bearer "+jwtNewToken,
        });

    } catch (error) {
        next(error);
    };
};