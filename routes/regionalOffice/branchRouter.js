import express from 'express';
const branchRouter = express.Router();
export default branchRouter;

import { createBranch , getAllBranch } from '../../controllers/regionalOffice/branchController.js';

branchRouter.use("/create" , createBranch );
branchRouter.use("/all" , getAllBranch );