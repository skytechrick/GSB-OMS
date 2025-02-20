import express from 'express';
const supportOfficeRouter = express.Router();
export default supportOfficeRouter;

import { createSupportOffice , getAllsupportOffices , createSupportManager , getAllSupportManager } from '../../controllers/branch/supportOfficeController.js';


supportOfficeRouter.post("/create" , createSupportOffice);
supportOfficeRouter.post("/all" , getAllsupportOffices);
supportOfficeRouter.post("/manager/create" , createSupportManager);
supportOfficeRouter.post("/manager/all" , getAllSupportManager);