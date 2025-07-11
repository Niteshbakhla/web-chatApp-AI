import { Mic, MoreVertical, Phone, Send, Video, MoveLeft, Smile, Image, X } from 'lucide-react';
import { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axiosinstance from '../axios/axios';
import { useSocket } from '../context/SocketContext';


const ChatBox = ({ selectedUser, setSelectedUser }) => {
            const [usersMessages, setUsersMessages] = useState([]);
            const messagesEndRef = useRef(null);
            const [message, setMessage] = useState('');
            const { currentUserId, socket } = useSocket();
            const [isUserTyping, setIsUserTyping] = useState(false);
            const [file, setFile] = useState(null);
            const fileRef = useRef();
            const scrollToBottom = () => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            };

            const typing = (e) => {
                        setMessage(e.target.value)
                        socket.emit("typing", { receiverId: selectedUser._id, senderId: currentUserId })
            }

            useEffect(() => {
                        socket.on("recieveMessage", (msg) => {
                                    setUsersMessages(prev => [...prev, msg])
                        })
                        socket.on("typing", ({ senderId }) => {
                                    if (senderId === selectedUser._id) {
                                                setIsUserTyping(true)
                                                setTimeout(() => {
                                                            setIsUserTyping(false)
                                                }, 3000);
                                    }

                        })

                        return () => {
                                    socket.off("recieveMessage")
                                    socket.off("typing")
                        }
            }, [selectedUser, socket])

            useEffect(() => {
                        scrollToBottom();
            }, [usersMessages, selectedUser]);

            useEffect(() => {
                        const getUserMessages = async () => {
                                    try {
                                                const { data } = await axiosinstance.get(`/api/messages/${selectedUser?._id}`)
                                                setUsersMessages(data.messages)

                                    } catch (error) {
                                                console.log("Get all message:", error);
                                    }
                        }

                        getUserMessages();
            }, [selectedUser, currentUserId])

            const handleSendMessage = async () => {
                        if (!file && !message.trim()) return;
                        try {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    const { data } = await axiosinstance.post("/api/messages/upload", formData);

                                    const newMessage = {
                                                receiverId: selectedUser._id,
                                                message,
                                                imageUrl: data.imageUrl
                                    }
                                    socket.emit("sendMessage", newMessage);
                                    setUsersMessages(prev => [...prev, { ...newMessage, sender: currentUserId, createdAt: new Date(), imageUrl:data.imageUrl }])

                                    setMessage('');
                        } catch (error) {

                        }

            };

            const handleKeyPress = (e) => {
                        if (e.key === 'Enter') {
                                    handleSendMessage();
                        }
            };

            const convertTime = (time) => {
                        const date = new Date(time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                        })
                        return date
            }

            const handleFile = (e) => {
                        const file = e.target.files[0];
                        if (file && file.type.startsWith(`image/`)) {
                                    setFile(file);
                        } else {
                                    alert("Please select an image file!")
                        }
            }
            return (
                        <div className={`lg:flex-1  md:flex flex-col ${selectedUser ? "block" : "hidden"}   h-screen md:relative  sm:w-full`}>
                                    <>
                                                {/* Chat Header */}

                                                <div div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between" >
                                                            <div className='flex items-center gap-2 '>
                                                                        <div onClick={() => setSelectedUser("")} className='md:hidden cursor-pointer'>
                                                                                    <MoveLeft color='blue' />
                                                                        </div>
                                                                        <div className="flex items-center space-x-3">
                                                                                    <div className="relative">
                                                                                                <img
                                                                                                            src={selectedUser?.avatar}
                                                                                                            alt={selectedUser?.username}
                                                                                                            className="w-10 h-10 rounded-full object-cover"
                                                                                                />
                                                                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                                                                                            }`} />
                                                                                    </div>
                                                                                    <div>
                                                                                                <h2 className="font-semibold text-gray-900">{selectedUser?.username}</h2>
                                                                                                <p className="text-sm text-gray-500">
                                                                                                            {isUserTyping ? 'Typing....' : 'Last seen recently'}
                                                                                                </p>
                                                                                    </div>
                                                                        </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                                                    <Video className="h-5 w-5 text-gray-600" />
                                                                        </button>
                                                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                                                    <Phone className="h-5 w-5 text-gray-600" />
                                                                        </button>
                                                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                                                    <MoreVertical className="h-5 w-5 text-gray-600" />
                                                                        </button>
                                                            </div>
                                                </div >
                                                {/* Messages */}
                                                <div className="flex-1 h-[75vh] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                                                            {usersMessages?.map(msg => (
                                                                        <div
                                                                                    key={msg._id}
                                                                                    className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
                                                                        >
                                                                                    <div
                                                                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl space-y-2 ${msg.sender === currentUserId
                                                                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                                                                                            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                                                                                            }`}
                                                                                    >
                                                                                                {/* Message text */}
                                                                                                {msg.message && (
                                                                                                            <p className="text-sm break-words">{msg.message}</p>
                                                                                                )}

                                                                                                {/* Render image if exists */}
                                                                                                {msg.imageUrl && (
                                                                                                            <img
                                                                                                                        src={msg.imageUrl}
                                                                                                                        alt="uploaded"
                                                                                                                        className="rounded-lg max-w-full max-h-64 shadow-md border border-gray-200 object-cover"
                                                                                                            />
                                                                                                )}

                                                                                                {/* Time */}
                                                                                                <p className={`text-xs mt-1 ${msg.sender === currentUserId ? 'text-emerald-100' : 'text-gray-500'}`}>
                                                                                                            {convertTime(msg.createdAt)}
                                                                                                </p>
                                                                                    </div>
                                                                        </div>
                                                            ))}
                                                            <div ref={messagesEndRef} />
                                                </div>

                                                {/* Message Input */}
                                                <div className="p-4 bg-white border-t border-gray-200 ">
                                                            <div className="flex items-center space-x-2">
                                                                        {/* File select button */}
                                                                        <button
                                                                                    onClick={() => fileRef.current.click()}
                                                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                                                        >
                                                                                    <Image className="h-5 w-5 text-gray-600" />
                                                                                    <input
                                                                                                onChange={handleFile}
                                                                                                ref={fileRef}
                                                                                                type="file"
                                                                                                accept="image/*"
                                                                                                className='hidden'
                                                                                    />
                                                                        </button>

                                                                        {/* Text input */}
                                                                        <div className="flex-1 relative">
                                                                                    <input
                                                                                                type="text"
                                                                                                placeholder="Type a message..."
                                                                                                className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                                                                value={message}
                                                                                                onChange={(e) => typing(e, selectedUser._id)}
                                                                                                onKeyDown={handleKeyPress}
                                                                                    />
                                                                                    <button className="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                                                                                                <Smile className="h-4 w-4 text-gray-600" />
                                                                                    </button>
                                                                        </div>

                                                                        {/* Send text message */}
                                                                        {message.trim() ? (
                                                                                    <button
                                                                                                onClick={handleSendMessage}
                                                                                                className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
                                                                                    >
                                                                                                <Send className="h-5 w-5" />
                                                                                    </button>
                                                                        ) : (
                                                                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                                                                <Mic className="h-5 w-5 text-gray-600" />
                                                                                    </button>
                                                                        )}
                                                            </div>

                                                            {/* 🖼 Preview & Send Image button (only show if image is selected) */}
                                                            {file && (
                                                                        <div className="mt-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2">
                                                                                    {/* Image preview */}
                                                                                    <div className="flex items-center gap-2">
                                                                                                <img
                                                                                                            src={URL.createObjectURL(file)}
                                                                                                            alt="Preview"
                                                                                                            className="w-16 h-16 object-cover rounded"
                                                                                                />
                                                                                                <p className="text-sm text-gray-700">{file.name}</p>
                                                                                    </div>

                                                                                    {/* Send Image button */}
                                                                                    <div className='flex items-center gap-2'>
                                                                                                <button
                                                                                                            onClick={() => {
                                                                                                                        handleSendMessage()
                                                                                                                        // console.log('Send image file:', file);
                                                                                                                        setFile(null); // reset after sending
                                                                                                            }}
                                                                                                            className="ml-4 px-3 py-1 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                                                                                                >
                                                                                                            Send Image
                                                                                                </button>
                                                                                                <button
                                                                                                            onClick={() => setFile(null)}
                                                                                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                                                                >
                                                                                                            <X className="w-4 h-4 text-gray-600" />
                                                                                                </button>
                                                                                    </div>
                                                                        </div>
                                                            )}
                                                </div>

                                    </>
                        </div>
            )
}

export default ChatBox




