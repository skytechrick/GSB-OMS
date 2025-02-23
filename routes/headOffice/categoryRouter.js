import express from 'express';
const categoryRouter = express.Router();
export default categoryRouter;

import { uploadCategoryMiddleware } from '../../middlewares/upload.js';
import { createCategory , getAllCategories , createSubCategory , getAllSubCategories } from '../../controllers/headOffice/categoryController.js';

categoryRouter.post("/create" , uploadCategoryMiddleware , createCategory );
categoryRouter.post("/all" , getAllCategories );
categoryRouter.post("/sub/create", createSubCategory );
categoryRouter.post("/sub/all", getAllSubCategories );

