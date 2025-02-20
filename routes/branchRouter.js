import express from 'express';
const branchRouter = express.Router();
export default branchRouter;

import authBranchRouter from "./branch/authBranchRouter.js";
import supportOfficeRouter from "./branch/supportOfficeRouter.js";
import { verifyBranchManager } from '../middlewares/verifyToken.js';

branchRouter.use("/auth" , authBranchRouter );
branchRouter.use("/support-office" , verifyBranchManager , supportOfficeRouter );

