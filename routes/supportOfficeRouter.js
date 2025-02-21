import express from "express";
const supportOfficeRouter = express.Router();
export default supportOfficeRouter;

import authSupportOfficeRouter from "./supportOffice/authSupportOfficeRouter.js";
import sellerRouter from "./supportOffice/sellerRouter.js";

supportOfficeRouter.use("/auth" , authSupportOfficeRouter);
supportOfficeRouter.use("/seller" , sellerRouter);