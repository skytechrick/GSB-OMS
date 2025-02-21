import express from 'express';
const supportOfficeRouter = express.Router();
export default supportOfficeRouter;

import { createSupportOffice , getAllsupportOffices , createSupportManager , getAllSupportManager,
    createSupportAssistant , getAllSupportAssistant , createDeliveryAgent , getAllDeliveryAgent } from '../../controllers/branch/supportOfficeController.js';


supportOfficeRouter.post("/create" , createSupportOffice);
supportOfficeRouter.post("/all" , getAllsupportOffices);
supportOfficeRouter.post("/manager/create" , createSupportManager);
supportOfficeRouter.post("/manager/all" , getAllSupportManager);
supportOfficeRouter.post("/assistant/create" , createSupportAssistant);
supportOfficeRouter.post("/assistant/all" , getAllSupportAssistant);
supportOfficeRouter.post("/delivery/create" , createDeliveryAgent);
supportOfficeRouter.post("/delivery/all" , getAllDeliveryAgent);