import express from 'express';
const dashboardHeadOfficeRouter = express.Router();
export default dashboardHeadOfficeRouter;

import { home } from '../../controllers/headOffice/dashboardHeadOfficeController.js';

dashboardHeadOfficeRouter.post("/" , home);


// dashboardHeadOfficeRouter.post("/get-all-employees" , getAllEmployees);
// dashboardHeadOfficeRouter.post("/get-employee" , getEmployee);
// dashboardHeadOfficeRouter.post("/add-employee" , addEmployee);
// dashboardHeadOfficeRouter.post("/update-employee" , updateEmployee);
// dashboardHeadOfficeRouter.post("/delete-employee" , deleteEmployee);
// dashboardHeadOfficeRouter.post("/get-all-branches" , getAllBranches);
// dashboardHeadOfficeRouter.post("/get-branch" , getBranch);
// dashboardHeadOfficeRouter.post("/add-branch" , addBranch);
// dashboardHeadOfficeRouter.post("/update-branch" , updateBranch);
// dashboardHeadOfficeRouter.post("/delete-branch" , deleteBranch);
// dashboardHeadOfficeRouter.post("/get-all-branches" , getAllBranches);
// dashboardHeadOfficeRouter.post("/get-branch" , getBranch);
// dashboardHeadOfficeRouter.post("/add-branch" , addBranch);

