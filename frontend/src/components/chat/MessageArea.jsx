import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import socketService from '../../services/socketService';

const MessageArea = ({ conversation, messages, currentUser, onSendMessage, onBack }) => {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);

    useEffect(() => {
        // Scroll to bottom when messages change
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Listen for typing indicators
        socketService.onUserTyping((data) => {
            if (data.userId !== currentUser._id) {
                setTypingUser(data.userName);
            }
        });

        socketService.onUserStopTyping((data) => {
            if (data.userId !== currentUser._id) {
                setTypingUser(null);
            }
        });

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [currentUser._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);

        // Emit typing indicator
        if (!isTyping) {
            setIsTyping(true);
            socketService.emitTyping({
                conversationId: conversation._id,
                userId: currentUser._id,
                userName: currentUser.name
            });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socketService.emitStopTyping({
                conversationId: conversation._id,
                userId: currentUser._id
            });
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
            setIsTyping(false);
            socketService.emitStopTyping({
                conversationId: conversation._id,
                userId: currentUser._id
            });
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <FaArrowLeft />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {otherParticipant?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">{otherParticipant?.name}</h4>
                    <p className="text-gray-400 text-xs capitalize">{otherParticipant?.role}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    const isOwnMessage = message.sender._id === currentUser._id;

                    return (
                        <div
                            key={message._id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 ${isOwnMessage
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                            : 'bg-white/10 text-white'
                                        }`}
                                >
                                    <p className="text-sm break-words">{message.content}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                    {formatTime(message.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {typingUser && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-2">
                            <p className="text-gray-400 text-sm italic">{typingUser} is typing...</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageArea;
