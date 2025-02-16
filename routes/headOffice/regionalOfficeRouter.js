import express from 'express';
const regionalOfficeRouter = express.Router();
export default regionalOfficeRouter;

import { dashboard , createRegionalOffice , getAllRegionalOffices , createRegionalOfficer , getAllRegionalOfficer } from '../../controllers/headOffice/regionalOfficeController.js';

regionalOfficeRouter.post("/create" , createRegionalOffice);
regionalOfficeRouter.post("/all" , getAllRegionalOffices);
regionalOfficeRouter.post("/officer/create" , createRegionalOfficer);
regionalOfficeRouter.post("/officer/all" , getAllRegionalOfficer);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);
// regionalOfficeRouter.post("/dashboard" , dashboard);