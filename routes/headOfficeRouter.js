import express from 'express';
const headOfficeRouter = express.Router();
export default headOfficeRouter;

import authHeadOfficeRouter from './headOffice/authHeadOfficeRouter.js';
import dashboardHeadOfficeRouter from './headOffice/dashboardHeadOfficeRouter.js';
import regionalOfficeRouter from './headOffice/regionalOfficeRouter.js';
import { verifyHeadquater } from '../middlewares/verifyToken.js';



headOfficeRouter.use("/auth" , authHeadOfficeRouter );
// headOfficeRouter.use("/dashboard" , dashboardHeadOfficeRouter );
headOfficeRouter.use("/regional-office" , verifyHeadquater , regionalOfficeRouter );
