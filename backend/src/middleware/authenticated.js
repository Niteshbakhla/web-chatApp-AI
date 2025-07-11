import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import config from "../config/config.js";

const isAuthenticated = asyncHandler(
            async (req, res, next) => {
                        let token = req.cookies?.token;
                        if (!token) {
                                    throw new CustomError("Not authorized , not token", 401)
                        }

                        try {
                                    const decoded = jwt.verify(token, config.JWT_SECRET);
                                    req.user = await User.findById(decoded.id).select("-password");
                                    next();
                        } catch (error) {
                                    return res.status(401).json({ message: "Not authorized, token failed" });
                        }
            }
);

export default isAuthenticated;
