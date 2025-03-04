import express from 'express';
const accountRouter = express.Router();
export default accountRouter;

import { getAccount } from '../../controllers/headoffice/accountController.js';

accountRouter.post("/" , getAccount );