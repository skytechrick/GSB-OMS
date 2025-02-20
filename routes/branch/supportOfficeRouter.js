import express from 'express';
const supportOfficeRouter = express.Router();
export default supportOfficeRouter;

import { createSupportOffice } from '../../controllers/branch/supportOfficeController.js';


supportOfficeRouter.post("/create" , createSupportOffice);
// supportOfficeRouter.post("/all" , createSupportOffice);
// supportOfficeRouter.post("/manager/create" , createSupportOffice);
// supportOfficeRouter.post("/manager/all" , createSupportOffice);