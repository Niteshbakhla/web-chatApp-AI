import cookie from "cookie";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config/config.js";

export const socketMidde = asyncHandler(async (socket, next) => {
            const cookies = socket.handshake.headers?.cookie;
            // return console.log(cookies)
            if (!cookies) {
                        socket.userId = null;
                        return next();
            }

            const parseCookies = cookie.parse(cookies);
            const token = parseCookies?.token;

            if (!token) {
                        socket.userId = null;
                        return next();
            }


            const decoded = jwt.verify(token, config.JWT_SECRET);
            socket.userId = decoded.id;
            next();
})