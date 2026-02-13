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
            {/* Floating Chat Button - Matrix Nexus */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/40 transition-all duration-500 z-50 hover:scale-110 active:scale-90 group border border-white/20"
                >
                    <div className="absolute inset-0 bg-gradient-premium rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <FaComments className="text-white text-2xl relative z-10" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-brand-darker z-20 shadow-xl">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </button>
            )}

            {/* Chat Window - Immersive Interface */}
            {isOpen && (
                <div className="fixed bottom-8 right-8 w-[420px] h-[650px] glass-card rounded-[2.5rem] shadow-3xl flex flex-col z-50 overflow-hidden border-white/10 fade-in bg-brand-darker/60 backdrop-blur-[80px]">
                    {/* Header - Matrix Node */}
                    <div className="bg-white/[0.03] p-6 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/30">
                                <FaComments className="text-brand-primary text-lg" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm tracking-tight">SkillUp Nexus</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mt-1">Operational</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 glass-button rounded-xl flex items-center justify-center text-discord-text-muted hover:text-white transition-all border-white/5"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Content Matrix */}
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
