import express from 'express';
const supportAssistantRouter = express.Router();
export default supportAssistantRouter;

import authSupportAssistantRouter from './supportAssistant/authSupportAssistantController.js';

supportAssistantRouter.use("/auth", authSupportAssistantRouter);