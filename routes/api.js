import express from 'express';
const api = express.Router();
export default api;

import deviceCheck from '../middlewares/deviceCheck.js';
import headOfficeRouter from './headOfficeRouter.js';
import regionalOfficeRouter from './regionalOfficeRouter.js';

api.use(deviceCheck);

api.use("/head-office" , headOfficeRouter);
api.use("/regional-office" , regionalOfficeRouter );
// api.use("/branch" );
// api.use("/support-office" );

