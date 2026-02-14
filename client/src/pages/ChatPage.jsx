import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ChatPage = () => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const loadHistory = async () => {
        try {
            const response = await api.get('/chat/history');
            setMessages(response.data);
        } catch (err) {
            console.error("Failed to load chat history", err);
        }
    };

    const handleSend = async (e, text = null) => {
        if (e) e.preventDefault();
        const msgText = text || input;

        if (!msgText.trim()) return;

        const userMsg = { role: 'user', message: msgText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/chat/message', {
                message: userMsg.message,
                language: language
            });

            const botMsg = { role: 'bot', message: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg = { role: 'bot', message: "Sorry, I couldn't reach the server. Please check your connection." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "How do I treat Early Blight in tomatoes?",
        "What is the best fertilizer for corn?",
        "How much water does wheat need?",
        "Identify this pest for me."
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-5xl mx-auto w-full bg-white dark:bg-surface-dark rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm overflow-hidden relative">

            {/* Header */}
            <div className="bg-white dark:bg-surface-dark border-b border-[#f0f4f0] dark:border-[#2a3c2e] p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">smart_toy</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-main dark:text-white leading-tight">Agri-Assistant</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-text-light dark:text-text-secondary-dark font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <button className="text-text-light hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f6f8f6] dark:bg-[#1a2c1e]">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">forum</span>
                        <p className="text-text-light dark:text-text-secondary-dark font-medium">Ask me anything about your farm!</p>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {messages.map((msg, index) => {
                        const isBot = msg.role === 'bot';
                        return (
                            <div key={index} className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
                                {isBot && (
                                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-2">
                                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                                    </div>
                                )}
                                <div className={`
                                    max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${isBot
                                        ? 'bg-white dark:bg-surface-light text-text-main rounded-tl-none border border-[#e0e6e0] dark:border-[#2a3c2e] dark:text-gray-200'
                                        : 'bg-primary text-white rounded-tr-none'}
                                `}>
                                    <p>{msg.message}</p>
                                </div>
                                {!isBot && (
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 flex-shrink-0 mt-2">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex gap-4 justify-start">
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-2">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </div>
                            <div className="bg-white dark:bg-surface-light p-4 rounded-2xl rounded-tl-none border border-[#e0e6e0] dark:border-[#2a3c2e] flex items-center gap-1">
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-surface-dark border-t border-[#f0f4f0] dark:border-[#2a3c2e]">
                {/* Suggestions */}
                {messages.length === 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(null, q)}
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-[#f0f4f0] dark:bg-white/5 border border-[#dbe6dc] dark:border-[#2a3c2e] text-sm text-text-main dark:text-white hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <button type="button" className="p-3 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-[#f6f8f6] dark:bg-[#1a2c1e] text-text-main dark:text-white border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 rounded-xl bg-primary text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all flex items-center justify-center aspect-square"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
