import { app } from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import { Server } from "socket.io";
import { createServer } from "http";
connectDB();

const PORT = config.PORT;

const server = createServer(app);
const io = new Server(server, {
            cors: {
                        origin: config.FRONTEND_URL,
                        methods: ["GET", "POST"]
            }
});


io.on("connection", (socket) => {
            console.log("User connected", socket.id);
})

server.listen(5000, () => {
            console.log(`Server is listening at port ${PORT}`);
})
