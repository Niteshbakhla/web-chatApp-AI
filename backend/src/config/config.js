import { config } from "dotenv";
config();


const _config = {
            PORT: process.env.PORT,
            MONGO_URI: process.env.MONGO_URI,
            FRONTEND_URL: process.env.FRONTEND_URL
}

export default Object.freeze(_config);