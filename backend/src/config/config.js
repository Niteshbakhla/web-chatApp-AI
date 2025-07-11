import { config } from "dotenv";
config();


const _config = {
            PORT: process.env.PORT,
            MONGO_URI: process.env.MONGO_URI,
            FRONTEND_URL: process.env.FRONTEND_URL,
            NODE_ENV: process.env.NODE_ENV,
            JWT_SECRET: process.env.JWT_SECRET,
            CLOUD_NAME: process.env.CLOUD_NAME,
            CLOUD_KEY: process.env.CLOUD_KEY,
            CLOUD_API_SECRET: process.env.CLOUD_API_SECRET
}


export default Object.freeze(_config);