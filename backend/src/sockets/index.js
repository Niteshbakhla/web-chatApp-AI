import { io } from "../../server.js";
import { socketMidde } from "../middleware/socketMiddle.js";
import Message from "../models/Message.js";



export const socketConnection = (io) => {
            io.on("connection", (socket) => {
                        // console.log("New user connected:", socket.id);
                        const userId = socket.userId
                        socket.join(userId);
                        // Join user to a room (you can use userId)
                        // console.log(`User ${userId} joined their roome`);

                        socket.on("sendMessage", async ({ receiverId, message }) => {
                                    // console.log(`Message from ${userId} to ${receiverId}:${message}`);
                                    const userMessage = await Message.create({ sender: userId, receiver: receiverId, message });
                                    // Emit message to reciever
                                    io.to(receiverId).emit("recieveMessage", userMessage);
                        });

                        socket.on("typing", ({ receiverId, senderId }) => {
                                    io.to(receiverId).emit("typing", { senderId });
                        });

                        socket.on("disconnect", () => {
                                    console.log(`User disconnected ${socket.id}`)
                        })
            });
}