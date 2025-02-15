import express from 'express';
const regionalOfficeRouter = express.Router();
export default regionalOfficeRouter;

import { home } from '../../controllers/headOffice/regionalOfficeController.js';

regionalOfficeRouter.post("/" , home);