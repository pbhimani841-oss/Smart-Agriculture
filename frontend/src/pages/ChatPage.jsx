import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../services/api';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: 'Hello! I am your AI Agricultural Assistant. How can I help you today? 🌱' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to UI immediately
        const newUserMsg = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const response = await api.post('/chat', { message: userMessage });
            if (response.data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'assistant',
                    content: response.data.reply
                }]);
            } else {
                throw new Error("API reported failure");
            }
        } catch (error) {
            console.error("Chat error:", error);

            // Extract meaningful error message if available from the backend
            let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
            if (error.response && error.response.data) {
                if (error.response.data.error && error.response.data.error.error && error.response.data.error.error.message) {
                    errorMessage = "API Error: " + error.response.data.error.error.message;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                content: errorMessage,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] p-4 flex flex-col">
            <div className="bg-white rounded-t-xl shadow-sm border-b pb-4 p-6 flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <Bot size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Agricultural AI Assistant</h1>
                    <p className="text-sm text-gray-500">Ask me about crops, soil, pest control, and farming techniques.</p>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6 border-x border-gray-200">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Bubble */}
                            <div className={`px-5 py-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : msg.isError
                                    ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-none'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white px-5 py-4 rounded-2xl border border-gray-200 shadow-sm rounded-bl-none flex space-x-2 items-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 rounded-b-xl border-t border-x border-gray-200 shadow-sm">
                <form onSubmit={handleSend} className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your agricultural question here..."
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-full focus:ring-green-500 focus:border-green-500 block w-full px-6 py-3"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full p-3 w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
