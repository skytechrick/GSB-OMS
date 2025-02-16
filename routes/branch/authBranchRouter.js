import express from 'express';
const authBranchRouter = express.Router();
export default authBranchRouter;

import { login, loginVerifyOtp } from "../../controllers/branch/authBranchController.js";

authBranchRouter.post("/login" , login );
authBranchRouter.post("/login-verify-otp" , loginVerifyOtp );