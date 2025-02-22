import express from 'express';
const supportAssistantRouter = express.Router();
export default supportAssistantRouter;


import { login , loginVerifyOtp } from "../../controllers/supportAssistant/authSupportAssistantController.js";

supportAssistantRouter.post("/login" , login );
supportAssistantRouter.post("/login-verify-otp" , loginVerifyOtp );
