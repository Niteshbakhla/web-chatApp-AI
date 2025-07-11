import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axiosinstance from "../axios/axios";

const SocketContext = createContext();


export const SocketProvider = ({ children, userId }) => {
            const [socket, setSocket] = useState(null);
            const [currentUserId, setCurrentUserId] = useState("");

            useEffect(() => {
                        const newSocket = io(import.meta.env.VITE_APP_API_URL, {
                                    withCredentials: true
                        });
                        setSocket(newSocket)

                        return () => newSocket.close()
            }, [userId])

            useEffect(() => {
                        const getProfile = async () => {
                                    try {
                                                const { data } = await axiosinstance.get("/api/auth/profile");
                                                setCurrentUserId(data.user._id);
                                    } catch (error) {
                                                console.log("Profile error:", error)
                                    }
                        }

                        getProfile();
            }, [])

            return (
                        <SocketContext.Provider value={{ socket, currentUserId }}>{children}</SocketContext.Provider>
            )
}


export const useSocket = () => useContext(SocketContext);