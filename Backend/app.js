import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRoutes from './routes/AuthRoutes.js';
import { fetchProducts } from './controllers/fetchProducts.js';
import { protectRoute } from './middleware/Authmiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Enable CORS for all routes
app.use(cors());  // 🔥 Add this line

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to API");
});

app.use("/auth", AuthRoutes);
app.use("/dashboard", protectRoute, fetchProducts);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});
