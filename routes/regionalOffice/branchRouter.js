import express from 'express';
const branchRouter = express.Router();
export default branchRouter;

import { createBranch , getAllBranch , createBranchManager , getAllBranchManager } from '../../controllers/regionalOffice/branchController.js';

branchRouter.use("/create" , createBranch );
branchRouter.use("/all" , getAllBranch );
branchRouter.use("/manager/create" , createBranchManager );
branchRouter.use("/manager/all" , getAllBranchManager );