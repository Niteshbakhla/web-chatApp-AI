import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();


export const SocketProvider = ({ children, userId }) => {
            const [socket, setSocket] = useState(null);

            useEffect(() => {
                        const newSocket = io(import.meta.env.VITE_APP_API_URL, {
                                    withCredentials: true
                        });
                        if (userId) {
                                    newSocket.emit("join", userId);
                        }

                        setSocket(newSocket)

                        return () => newSocket.close()
            }, [userId])

            return (
                        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
            )
}


export const useSocket = () => useContext(SocketContext);