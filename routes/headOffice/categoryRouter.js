import express from 'express';
const categoryRouter = express.Router();
export default categoryRouter;

import { createCategory } from '../../controllers/headOffice/categoryController.js';
import { uploadCategoryMiddleware } from '../../middlewares/upload.js';

categoryRouter.post("/create" , uploadCategoryMiddleware , createCategory );
// categoryRouter.use("/get-all" , getAllCategories );

