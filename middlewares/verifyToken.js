import { verifyToken } from '../utils/jwtHandler.js';
import admin from '../models/admin.js';
export const verifyHeadquater = async ( req , res , next ) => {
    try {

        const isWeb = req.isWeb;
        req.token = null;
        if (isWeb) {
            if (req.signedCookies.admin) {
                req.token = req.signedCookies.admin;
            };
        }else{
            if (req.headers.Authorization) {
                const token = req.headers.Authorization.split(' ')[1];
                req.token = token;
            };
        };

        const token = req.token;
        if(!token){
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access"
            });
        };

        const decoded = await verifyToken(token);
        if(!decoded){
            if(isWeb){
                return res.status(401).clearCookie("admin").json({
                    status: "error",
                    message: "Unauthorized access"
                });
            }
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access"
            });
        };

        const adminToken = decoded.token;
        const adminId = decoded.id;
        const adminData = await admin.findById(adminId);
        if(!adminData){
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access"
            });
        };
        if(adminData.ban){
            if(isWeb){
                return res.status(401).clearCookie("admin").json({
                    status: "error",
                    message: "You are banned",
                    reason: adminData.banReason
                });
            }
            return res.status(401).json({
                status: "error",
                message: "You are banned",
                reason: adminData.banReason
            });
        };

        if(adminData.isVerified === false){
            if(isWeb){
                return res.status(401).clearCookie("admin").json({
                    status: "error",
                    message: "Your account is not verified"
                });
            }
            return res.status(401).json({
                status: "error",
                message: "Your account is not verified"
            });
        };

        if(adminData.loggedIn.token !== adminToken){
            if(isWeb){
                return res.status(401).clearCookie("admin").json({
                    status: "error",
                    message: "Unauthorized access"
                });
            }
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access"
            });
        };

        req.adminData = adminData;
        
        next();

    } catch (error) {
        next(error);
    };
};
