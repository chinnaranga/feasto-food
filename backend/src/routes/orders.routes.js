import express from "express";
import { createOrder, getMyOrders } from "../controllers/orders.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

export default router;
