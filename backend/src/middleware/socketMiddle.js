import cookie from "cookie";
import jwt from "jsonwebtoken";
import { io } from "../../server";
import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import config from "../config/config";

io.use(asyncHandler(async (socket, next) => {
            const cookies = socket.handshake.headers.cookie;
            if (!cookies) {
                        throw new CustomError("Unauthorized- no cookies", 401);
            }

            const parseCookies = cookie.parse(cookies);
            const token = parseCookies.token;
            if (!token) {
                        throw new CustomError("Unauthorized - no token in cookies")
            }


            const decoded = jwt.verify(token, config.JWT_SECRET);
            socket.userId = decoded.id;
            next();


}))