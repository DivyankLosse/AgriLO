import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatBubble = ({ message, role }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-500' : 'bg-green-600'}`}>
                    {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                </div>

                {/* Message Bubble */}
                <div
                    className={`p-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
                    ${isUser
                            ? 'bg-blue-500 text-white rounded-tr-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}
                >
                    {message}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
