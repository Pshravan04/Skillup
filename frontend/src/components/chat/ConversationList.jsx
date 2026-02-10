import React from 'react';
import { FaUser } from 'react-icons/fa';

const ConversationList = ({ conversations, onSelect, currentUserId }) => {
    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== currentUserId);
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;

        if (diff < 86400000) { // Less than 24 hours
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (conversations.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <FaUser className="text-gray-600 text-4xl mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No conversations yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start chatting with instructors!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                if (!otherUser) return null;

                return (
                    <div
                        key={conversation._id}
                        onClick={() => onSelect(conversation)}
                        className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {otherUser.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-white font-medium text-sm truncate">
                                        {otherUser.name}
                                    </h4>
                                    {conversation.updatedAt && (
                                        <span className="text-gray-500 text-xs">
                                            {formatTime(conversation.updatedAt)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-xs capitalize">
                                    {otherUser.role}
                                </p>
                                {conversation.course && (
                                    <p className="text-gray-500 text-xs mt-1 truncate">
                                        {conversation.course.title}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;
