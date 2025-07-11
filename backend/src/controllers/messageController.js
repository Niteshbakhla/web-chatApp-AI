import Message from "../models/Message.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";
import CustomError from "../utils/CustomError.js";

// @desc Save a new message
// @route POST /api/messages
export const sendMessage = async (req, res) => {
            const { senderId, receiverId, message } = req.body;

            if (!senderId || !receiverId || !message) {
                        throw new CustomError("Missing fields", 400)
            }

            const newMessage = new Message({
                        sender: senderId,
                        receiver: receiverId,
                        message,
            });

            await newMessage.save();

            res.status(201).json(newMessage);
};

// @desc Get all messages between 2 users
// @route GET /api/messages/:userId/:otherUserId
export const getMessages = async (req, res) => {
            const { otherUserId } = req.params;
            const userId = req.user._id;
            const messages = await Message.find({
                        $or: [
                                    { sender: userId, receiver: otherUserId },
                                    { sender: otherUserId, receiver: userId },
                        ],
            }).sort("createdAt");


            res.status(200).json({ messages });
};


export const uploadFile = asyncHandler(async (req, res) => {
            let imageUrl = null
            if (req.file) {
                        const result = await cloudinary.uploader.upload_stream(
                                    { resource_type: "image", folder: "chat_image" },
                                    async (error, result) => {
                                                if (error) throw new CustomError(error, 400);
                                                imageUrl = result.secure_url;
                                                res.status(201).json({ success: true, imageUrl });
                                    }
                        )
                        result.end(req.file.buffer);
            }
})