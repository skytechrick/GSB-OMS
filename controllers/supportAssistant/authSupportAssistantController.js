import crypto from 'crypto';
import supportManager from '../../models/supportManager.js';
import { loginSchema } from '../../utils/zodSchema.js';
import { comparePassword } from '../../utils/passwordHandler.js';
import { sendMail } from '../../utils/sendMail.js';
import { generateToken , verifyToken } from '../../utils/jwtHandler.js';
import supportAssistant from '../../models/supportAssistant.js';

export const login = async ( req , res , next ) => {
    try {
        
        const validData = loginSchema.safeParse(req.body);
        if (!validData.success) {
            return res.status(400).json({
                status: 'error',
                message: "Unauthorized access.",
            });
        };

        const { email , password } = validData.data;

        const token = crypto.randomBytes(32).toString("hex");
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiry = new Date(Date.now() + 300000);

        let supportAssistantData = await supportAssistant.findOne({
            email: email,
        });

        if (!supportAssistantData) {
            return res.status(400).json({
                status: 'error',
                message: "No account found with this email.",
            });
        };

        if(supportAssistantData.isBan){
            return res.status(400).json({
                status: 'error',
                message: "Your account has been banned.",
                reason: supportAssistantData.banReason,
            });
        };
        const isCorrect = await comparePassword(password , supportAssistantData.password);
        if (!isCorrect) {
            supportAssistantData.loggedIn.loginAttempts++;
            await supportAssistantData.save();
            return res.status(400).json({
                status: 'failed',
                message: "Incorrect password."
            });
        };

        const isMailSent = await sendMail({
            from: `No-reply <${process.env.NO_REPLY_MAIL_ID}>`,
            to: email,
            subject: "Support assistant Login | Notification",
            html: `<h1>Support assistant login OTP: ${otp}</h1>${Date().toLocaleString("en-IN")}`,
        });

        if(!isMailSent){
            return res.status(400).json({
                status: 'error',
                message: "Unable to send OTP."
            });
        };

        supportAssistantData.authentication = { otp , otpExpiry , token };
        await supportAssistantData.save();

        const jwtToken = generateToken({
            id: supportAssistantData._id,
            token,
            createdAt: Date.now(),
        });

        if(req.isWeb){
            return res.status(201).cookie("supportAssistantOtp" , jwtToken , {
                path: "/",
                httpOnly: true,
                sameSite: "none",
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

            if (!req.signedCookies.supportAssistantOtp) {
                return res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            };
            req.token = req.signedCookies.supportAssistantOtp;

        }else{
            if (!req.headers.authorization) {
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
                return res.status(401).clearCookie("supportAssistantOtp").send({
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

        const supportAssistantData = await supportAssistant.findById(decoded.id);

        if (!supportAssistantData) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        };

        if(supportAssistantData.authentication.token !== decoded.token){
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        };

        if (supportAssistantData.authentication.otp !== parseInt(otp, 10)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP',
            });
        };

        if (supportAssistantData.authentication.otpExpiry < Date.now()) {
            return res.status(400).json({
                status: 'error',
                message: 'OTP expired',
            });
        };

        const newToken = crypto.randomBytes(57).toString("hex");
        supportAssistantData.authentication = {
            otp: null,
            otpExpiry: null,
            token: null,
        };
        supportAssistantData.loggedIn = {
            token: newToken,
            lastLoggedIn: Date.now(),
            loginAttempts: 0,
        };
        supportAssistantData.isVerified = true;

        await supportAssistantData.save();

        const jwtNewToken = generateToken({
            id: supportAssistantData._id,
            token: newToken,
            createdAt: Date.now(),
        });

        if(isWeb){
            return res.status(200).clearCookie("supportAssistantOtp").cookie("supportAssistant" , jwtNewToken , {
                path: "/",
                httpOnly: true,
                sameSite: "none",
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