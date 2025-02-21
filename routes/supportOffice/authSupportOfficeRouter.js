import express from "express";
const authSupportOfficeRouter = express.Router();
export default authSupportOfficeRouter;

import { login , loginVerifyOtp } from "../../controllers/supportOffice/authSupportOfficeController.js";

authSupportOfficeRouter.post("/login" , login );
authSupportOfficeRouter.post("/login-verify-otp" , loginVerifyOtp );