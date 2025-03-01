import express from "express";
const supportOfficeRouter = express.Router();
export default supportOfficeRouter;

import authSupportOfficeRouter from "./supportOffice/authSupportOfficeRouter.js";
import sellerRouter from "./supportOffice/sellerRouter.js";
import productRouter from "./supportOffice/productRouter.js";
import { verifyOfficeManager } from "../middlewares/verifyToken.js";

supportOfficeRouter.use("/auth" , authSupportOfficeRouter);
supportOfficeRouter.use("/seller" , verifyOfficeManager , sellerRouter);
supportOfficeRouter.use("/product" , verifyOfficeManager , productRouter);