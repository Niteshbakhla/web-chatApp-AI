import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketConnection } from "./src/sockets/index.js";
import { socketMidde } from "./src/middleware/socketMiddle.js";
connectDB();

const PORT = config.PORT;

const server = createServer(app);
export const io = new Server(server, {
            cors: {
                        origin: config.FRONTEND_URL,
                        methods: ["GET", "POST"],
                        credentials: true
            }
});

io.use(socketMidde)
socketConnection(io);


server.listen(5000, () => {
            console.log(`Server is listening at port ${PORT}`);
})


