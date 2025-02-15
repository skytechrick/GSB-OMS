import express from 'express';
const authHeadOfficeRouter = express.Router();
export default authHeadOfficeRouter;

import { login , loginVerifyOtp } from '../../controllers/headoffice/authHeadOfficeController.js';

authHeadOfficeRouter.post('/login' , login );
authHeadOfficeRouter.post('/login-verify-otp' , loginVerifyOtp );
