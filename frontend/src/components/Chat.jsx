import React, { useState, useEffect, useContext } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import socketService from '../services/socketService';
import API from '../services/api';
import ConversationList from './chat/ConversationList';
import MessageArea from './chat/MessageArea';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            // Connect to Socket.io
            socketService.connect();

            // Fetch conversations
            fetchConversations();

            // Listen for new messages
            socketService.onMessageReceived((message) => {
                // Add message to active conversation
                if (activeConversation && message.conversation === activeConversation._id) {
                    setMessages(prev => [...prev, message]);
                } else {
                    // Update unread count
                    setUnreadCount(prev => prev + 1);
                }
                // Refresh conversations list
                fetchConversations();
            });

            return () => {
                socketService.removeAllListeners();
            };
        }
    }, [user, activeConversation]);

    const fetchConversations = async () => {
        try {
            const { data } = await API.get('/conversations');
            setConversations(data);

            // Calculate unread count
            const unread = data.reduce((count, conv) => {
                // This is simplified - you'd need to track actual unread messages
                return count;
            }, 0);
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const handleConversationSelect = async (conversation) => {
        setActiveConversation(conversation);

        // Join conversation room
        socketService.joinConversation(conversation._id);

        // Fetch messages
        try {
            const { data } = await API.get(`/conversations/${conversation._id}/messages`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = (content) => {
        if (!activeConversation || !content.trim()) return;

        socketService.sendMessage({
            conversationId: activeConversation._id,
            senderId: user._id,
            content: content.trim(),
        });
    };

    const handleNewConversation = async (participantId) => {
        try {
            const { data } = await API.post('/conversations', {
                participantId
            });
            setConversations(prev => [data, ...prev]);
            setActiveConversation(data);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-50"
                >
                    <FaComments className="text-white text-2xl" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-discord-dark rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaComments className="text-white text-xl" />
                            <h3 className="text-white font-semibold">Messages</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {!activeConversation ? (
                            <ConversationList
                                conversations={conversations}
                                onSelect={handleConversationSelect}
                                currentUserId={user._id}
                            />
                        ) : (
                            <MessageArea
                                conversation={activeConversation}
                                messages={messages}
                                currentUser={user}
                                onSendMessage={handleSendMessage}
                                onBack={() => setActiveConversation(null)}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
