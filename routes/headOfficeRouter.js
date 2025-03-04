import express from 'express';
const headOfficeRouter = express.Router();
export default headOfficeRouter;

import os from "node:os"
import authHeadOfficeRouter from './headOffice/authHeadOfficeRouter.js';
import dashboardHeadOfficeRouter from './headOffice/dashboardHeadOfficeRouter.js';
import regionalOfficeRouter from './headOffice/regionalOfficeRouter.js';
import { verifyHeadquater } from '../middlewares/verifyToken.js';
import categoryRouter from './headOffice/categoryRouter.js';
import accountRouter from './headOffice/accountRouter.js';

const systemInfoMiddleware = ( req , res , next ) => {
    const getSystemConfig = () => ({
        platform: os.platform(),
        osType: os.type(),
        osRelease: os.release(),
        architecture: os.arch(),
        cpuInfo: {
            model: os.cpus()[0].model,
            cores: os.cpus().length
        },
        memory: {
            total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
            free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`
        },
        uptime: `${(os.uptime() / 60 / 60).toFixed(2)} hours`,
        userInfo: os.userInfo(),
        networkInterfaces: os.networkInterfaces(),
        hostname: os.hostname()
    });
  
    req.systemConfig = getSystemConfig();
    return res.status(200).json(req.systemConfig);
};


headOfficeRouter.post("/system-info" , verifyHeadquater , systemInfoMiddleware );
headOfficeRouter.use("/auth" , authHeadOfficeRouter );
// headOfficeRouter.use("/dashboard" , dashboardHeadOfficeRouter );
headOfficeRouter.use("/regional-office" , verifyHeadquater , regionalOfficeRouter );
headOfficeRouter.use("/category" , verifyHeadquater , categoryRouter );
headOfficeRouter.use("/account" , verifyHeadquater , accountRouter );
