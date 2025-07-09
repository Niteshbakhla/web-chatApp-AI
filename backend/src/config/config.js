import { config } from "dotenv";
config();


const _config = {
            PORT: process.env.PORT,
            MONGO_URI: process.env.MONGO_URI,
            FRONTEND_URL: process.env.FRONTEND_URL,
            NODE_ENV: process.env.NODE_ENV,
            JWT_SECRET: process.env.JWT_SECRET
}

export default Object.freeze(_config);