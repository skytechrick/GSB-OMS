import express from 'express';
const headOfficeRouter = express.Router();
export default headOfficeRouter;

import authHeadOfficeRouter from './headOffice/authHeadOfficeRouter.js';
import dashboardHeadOfficeRouter from './headOffice/dashboardHeadOfficeRouter.js';
import regionalOfficeRouter from './headOffice/regionalOfficeRouter.js';
import { verifyHeadquater } from '../middlewares/verifyToken.js';
import categoryRouter from './headOffice/categoryRouter.js';


headOfficeRouter.use("/auth" , authHeadOfficeRouter );
// headOfficeRouter.use("/dashboard" , dashboardHeadOfficeRouter );
headOfficeRouter.use("/regional-office" , verifyHeadquater , regionalOfficeRouter );
headOfficeRouter.use("/category" , verifyHeadquater , categoryRouter );
