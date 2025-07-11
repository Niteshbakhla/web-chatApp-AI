import User from "../models/User.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import config from "../config/config.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper: Generate JWT Token
const generateToken = (userId) => {
            return jwt.sign({ id: userId }, config.JWT_SECRET, {
                        expiresIn: "7d",
            });
};

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = asyncHandler(
            async (req, res) => {
                        const { username, email, password } = req.body;


                        // Basic validation
                        if (!username || !email || !password) {
                                    throw new CustomError("All fields are required", 400)
                        }

                        // Check existing user
                        const userExists = await User.findOne({ email });
                        if (userExists) {
                                    throw new CustomError("User already exists", 409)
                        }

                        // Create user
                        const user = await User.create({ username, email, password });

                        // Generate JWT
                        const token = generateToken(user._id);

                        // Send response
                        res
                                    .status(201)
                                    .cookie("token", token, {
                                                httpOnly: true,
                                                secure: process.env.NODE_ENV === "production",
                                                sameSite: "strict",
                                                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                                    })
                                    .json({
                                                success: true, message: "Register successfully",
                                                user: {
                                                            _id: user._id,
                                                            username: user.username,
                                                            email: user.email,
                                                            avatar: user.avatar,
                                                }

                                    });
            }
);

// @desc Login user
// @route POST /api/auth/login
export const loginUser = asyncHandler(
            async (req, res) => {
                        const { email, password } = req.body;
                        // Basic validation
                        if (!email || !password) {
                                    throw new CustomError("All fields are required", 400);
                        }

                        // Find user
                        const user = await User.findOne({ email }).select("+password");
                        if (!user) {
                                    throw new CustomError("Invalid credentials", 400);
                        }

                        // Check password
                        const isMatch = await user.matchPassword(password);
                        if (!isMatch) {
                                    throw new CustomError("Invalid credentials", 400);
                        }

                        // Generate JWT
                        const token = generateToken(user._id);

                        res.cookie("token", token)


                        // Send response
                        res
                                    .status(200)
                                    .cookie("token", token, {
                                                httpOnly: true,
                                                secure: config.NODE_ENV === "production",
                                                sameSite: "strict",
                                                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                                    })
                                    .json({
                                                success: true, message: "Login successfully",
                                                user: {
                                                            _id: user._id,
                                                            username: user.username,
                                                            email: user.email,
                                                            avatar: user.avatar,
                                                }
                                    });
            }
);

// @desc Logout user
// @route POST /api/auth/logout
export const logoutUser = asyncHandler(
            async (req, res) => {
                        res
                                    .cookie("token", "", {
                                                httpOnly: true,
                                                expires: new Date(0),
                                    })
                                    .status(200)
                                    .json({ message: "Logged out successfully" });
            }
);


// @desc isMe user
// @route get /api/auth/profile
export const isMe = asyncHandler(
            async (req, res) => {
                        const userId = req.user.id;
                        const user = await User.findById(userId)
                        res.status(200).json({ success: true, user })
            }
)

export const getAllUser = asyncHandler(
            async (req, res) => {
                        const userId = req.user._id;
                        const users = await User.find({ _id: { $ne: userId } }).sort({ createdAt: -1 });
                        if (!users) {
                                    throw new CustomError("No users found", 404);
                        }
                        res.status(200).json({ success: true, users })
            }
)