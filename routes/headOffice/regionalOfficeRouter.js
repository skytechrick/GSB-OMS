import express from 'express';
const regionalOfficeRouter = express.Router();
export default regionalOfficeRouter;

import { dashboard , createRegionalOffice , getAllRegionalOffices , createRegionalOfficer } from '../../controllers/headOffice/regionalOfficeController.js';

regionalOfficeRouter.post("/create" , createRegionalOffice);
regionalOfficeRouter.post("/all" , getAllRegionalOffices);
regionalOfficeRouter.post("/officer/create" , createRegionalOfficer);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);