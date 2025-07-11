import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser())
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

