import Message from "../models/Message.js";

export const socketConnection = (io) => {
            io.on("connection", (socket) => {
                        console.log("New user connected:", socket.id);
                        const userId = socket.userId

                        // Join user to a room (you can use userId)
                        socket.on("join", () => {
                                    console.log(`User ${userId} joined their roome`);
                        });

                        socket.on("sendMessage", async ({ receiverId, message }) => {
                                    console.log(`Message from ${senderId} to ${receiverId}:${message}`);

                                    const userMessage = await Message.create({ sender: userId, receiver: receiverId, message });
                                    // Emit message to reciever
                                    io.to(receiverId).emit("recieveMessage", userMessage);
                        });

                        socket.on("typing", ({ recieverId }) => {
                                    io.to(recieverId).emit("typing");
                        });

                        socket.on("disconnect", () => {
                                    console.log(`User disconnected ${socket.id}`)
                        })
            });
}