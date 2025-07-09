import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cors({
            origin: "http://localhost:5173",
            credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);



// Global Error Hanlder
app.use(errorHandler)

export default app;

