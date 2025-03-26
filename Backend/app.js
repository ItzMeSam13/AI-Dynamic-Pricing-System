import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRoutes from './routes/AuthRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("welcome to API");
});
app.use("/auth", AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});