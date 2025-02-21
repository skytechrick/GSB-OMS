import express from 'express';
const api = express.Router();
export default api;

import deviceCheck from '../middlewares/deviceCheck.js';
import headOfficeRouter from './headOfficeRouter.js';
import regionalOfficeRouter from './regionalOfficeRouter.js';
import branchRouter from './branchRouter.js';
import supportOfficeRouter from './supportOfficeRouter.js';

api.use(deviceCheck);

api.use("/head-office" , headOfficeRouter);
api.use("/regional-office" , regionalOfficeRouter );
api.use("/branch" , branchRouter );
api.use("/support-office" , supportOfficeRouter );

