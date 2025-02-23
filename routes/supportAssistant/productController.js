import express from 'express';
const productRouter = express.Router();
export default productRouter;

import { createProduct } from '../../controllers/supportAssistant/productController.js';
import { uploadProductMiddleware } from '../../middlewares/upload.js';
import { productImageProcessMiddleWare } from '../../middlewares/productImageProcessMiddleWare.js';

productRouter.post("/create" , uploadProductMiddleware , productImageProcessMiddleWare , createProduct );