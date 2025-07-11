import { useState, useEffect } from 'react';
import { Send, Search, LogOut } from 'lucide-react';
import axiosinstance from '../axios/axios';
import ChatBox from '../components/ChatBox';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';


const ChatApp = () => {
            const [selectedUser, setSelectedUser] = useState(null);
            const [searchTerm, setSearchTerm] = useState('');
            const [chatUsers, setChatUsers] = useState([]);
            const navigate = useNavigate();
            const { currentUserId } = useSocket();


            const filteredUsers = chatUsers?.filter(user =>
                        user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );

            useEffect(() => {
                        const fetchAllUsers = async () => {
                                    try {
                                                const { data } = await axiosinstance.get("/api/auth/users");
                                                setChatUsers(data.users);
                                    } catch (error) {
                                                console.log("fetch users:-", error)
                                    }

                        }
                        fetchAllUsers();
            }, [])


            const logoutHandler = async () => {
                        try {
                                    const { data } = await axiosinstance.get("/api/auth/logout");
                                    toast.success(data.message)
                                    navigate("/auth");
                        } catch (error) {
                                    toast.error(error.response.data.message);
                                    console.log("Logout error:", error);
                        }
            }

            return (
                        <div className="md:flex h-screen bg-gray-100">
                                    {/* Sidebar */}
                                    <div className={`md:w-1/3 bg-white border-r border-gray-200 flex flex-col lg:block ${selectedUser ? "hidden" : ""}`}>
                                                {/* Header */}
                                                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex justify-between">
                                                            <h1 className="text-xl font-bold">Messages</h1>
                                                            <button
                                                                        onClick={logoutHandler}
                                                                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-white b from-emerald-500 to-teal-600 cursor-pointer px-2 py-1 rounded transition-colors duration-200 md:px-3 md:py-1.5"
                                                            >
                                                                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                                                                        <span className="hidden sm:inline">Logout</span>
                                                            </button>
                                                </div>

                                                {/* Search */}
                                                <div className="p-4 border-b border-gray-200">
                                                            <div className="relative">
                                                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                        <input
                                                                                    type="text"
                                                                                    placeholder="Search conversations..."
                                                                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                                                    value={searchTerm}
                                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                        />
                                                            </div>
                                                </div>

                                                {/* User List */}
                                                <div className={`flex-1 overflow-y-auto  `}>
                                                            {filteredUsers.length !== 0 ? filteredUsers.map(user => (
                                                                        <div
                                                                                    key={user._id}
                                                                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === user.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                                                                                                }`}
                                                                                    onClick={() => setSelectedUser(user)}
                                                                        >
                                                                                    <div className="flex items-center space-x-3">
                                                                                                <div className="relative">
                                                                                                            <img
                                                                                                                        src={user?.avatar}
                                                                                                                        alt={user.username}
                                                                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                                                            />
                                                                                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                                                                                                        }`} />
                                                                                                </div>
                                                                                                <div className="flex-1 min-w-0">
                                                                                                            <div className="flex items-center justify-between">
                                                                                                                        <h3 className="font-semibold text-gray-900 truncate">{user.username}</h3>
                                                                                                                        <span className="text-xs text-gray-500">{user.timestamp}</span>
                                                                                                            </div>
                                                                                                            <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
                                                                                                </div>
                                                                                                {user?.unread > 0 && (
                                                                                                            <div className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                                                                        {user?.unread}
                                                                                                            </div>
                                                                                                )}
                                                                                    </div>
                                                                        </div>
                                                            )) : <h1 className='text-center mt-10 text-3xl'>No users found</h1>}
                                                </div>
                                    </div>

                                    {/* Chat Area */}
                                    {

                                                currentUserId ? <ChatBox selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> : <div className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                                                            <div className="text-center">
                                                                        <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                                    <Send className="h-12 w-12 text-white" />
                                                                        </div>
                                                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chat</h2>
                                                                        <p className="text-gray-600">Select a conversation to start messaging</p>
                                                            </div>
                                                </div>
                                    }
                        </div>
            );
};

export default ChatApp;