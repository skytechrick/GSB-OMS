import express from 'express';
const regionalOfficeRouter = express.Router();
export default regionalOfficeRouter;
import authregionalOfficeRouter from './regionalOffice/authregionalOfficeRouter.js';


regionalOfficeRouter.use("/auth" , authregionalOfficeRouter );
