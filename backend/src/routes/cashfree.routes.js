import express from "express";
import { authorize } from "../middlewares/authorize.js";
import { createOrder, verifyPayment } from "../controllers/cashfree.controller.js";

const router = express.Router();

router.post("/create-order", authorize, createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
