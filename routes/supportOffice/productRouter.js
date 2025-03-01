import express from 'express';
const productRouter = express.Router();
export default productRouter;

import { getAllProducts , verifyNewProducts } from '../../controllers/supportOffice/productController.js';

productRouter.post("/all" , getAllProducts);
productRouter.patch("/verify-new-products" , verifyNewProducts);