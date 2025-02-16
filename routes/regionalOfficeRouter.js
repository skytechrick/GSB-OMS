import express from 'express';
const regionalOfficeRouter = express.Router();
export default regionalOfficeRouter;

import authregionalOfficeRouter from './regionalOffice/authregionalOfficeRouter.js';
import branchRouter from './regionalOffice/branchRouter.js';
import { verifyRegionalOfficer } from '../middlewares/verifyToken.js';

regionalOfficeRouter.use("/auth" , authregionalOfficeRouter );
regionalOfficeRouter.use("/branch" , verifyRegionalOfficer , branchRouter );
