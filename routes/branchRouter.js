import express from 'express';
const branchRouter = express.Router();
export default branchRouter;

import authBranchRouter from "./branch/authBranchRouter.js";

branchRouter.use("/auth" , authBranchRouter );

