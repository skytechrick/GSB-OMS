import express from 'express';
const headOfficeRouter = express.Router();
export default headOfficeRouter;

import authHeadOfficeRouter from './headOffice/authHeadOfficeRouter.js';

headOfficeRouter.use("/auth" , authHeadOfficeRouter );
