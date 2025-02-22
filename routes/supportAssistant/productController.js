import express from 'express';
const productRouter = express.Router();
export default productRouter;

import { createProduct } from '../../controllers/supportAssistant/productController.js';
import { uploadProductMiddleware } from '../../middlewares/upload.js';

productRouter.get("/create" , uploadProductMiddleware , createProduct );