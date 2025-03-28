import express from "express";
import { fetchProducts } from "../controllers/fetchProducts.js";

const router = express.Router();

router.get("/fetch-products/:userId", fetchProducts); // Fetch products based on userId from Supabase

export default router;
