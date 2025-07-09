// ChatBox.js
import { useSocket } from "../context/SocketContext";
import { useState, useEffect } from "react";

const ChatBox = ({ userId, receiverId }) => {
            const socket = useSocket();
            const [message, setMessage] = useState("");
            const [messages, setMessages] = useState([]);

            // Listen for incoming messages
            useEffect(() => {
                        if (!socket) return;

                        socket.on("receiveMessage", (data) => {
                                    console.log("Got message:", data);
                                    setMessages((prev) => [...prev, data]);
                        });

                        return () => socket.off("receiveMessage");
            }, [socket]);

            const handleSend = () => {
                        if (!message.trim()) return;

                        socket.emit("sendMessage", {
                                    receiverId: receiverId,
                                    message: message,
                        });

                        setMessages((prev) => [...prev, { senderId: userId, message }]);
                        setMessage("");
            };

            return (
                        <div>
                                    <div className="chat-window">
                                                {messages.map((msg, idx) => (
                                                            <div key={idx}>
                                                                        <b>{msg.senderId === userId ? "You" : "Them"}:</b> {msg.message}
                                                            </div>
                                                ))}
                                    </div>
                                    <input
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type a message"
                                    />
                                    <button onClick={handleSend}>Send</button>
                        </div>
            );
};

export default ChatBox;
