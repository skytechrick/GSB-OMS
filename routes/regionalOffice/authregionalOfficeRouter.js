import express from 'express';
const authregionalOfficeRouter = express.Router();
export default authregionalOfficeRouter;

import { login , loginVerifyOtp } from '../../controllers/regionalOffice/authRegionalOfficeController.js';

authregionalOfficeRouter.use("/login" , login );
authregionalOfficeRouter.use("/login-verify-otp" , loginVerifyOtp );