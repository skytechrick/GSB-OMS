import express from 'express';
const supportAssistantRouter = express.Router();
export default supportAssistantRouter;

import authSupportAssistantRouter from './supportAssistant/authSupportAssistantController.js';
import productRouter from './supportAssistant/productController.js';
import { verifySupportAssistant } from '../middlewares/verifyToken.js';

supportAssistantRouter.use("/auth" , authSupportAssistantRouter);
supportAssistantRouter.use("/product" , verifySupportAssistant , productRouter);