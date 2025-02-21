import express from "express";
const sellerRouter = express.Router();
export default sellerRouter;

import { createSeller , getAllSellers } from "../../controllers/supportOffice/sellerController.js";

sellerRouter.use("/create" , createSeller);
sellerRouter.use("/all" , getAllSellers);