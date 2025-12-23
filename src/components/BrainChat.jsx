import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Loader2, FileText, Sparkles, ExternalLink } from 'lucide-react';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import { Button } from './Button';

export const BrainChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hi! I'm your SecondBrain AI. I can analyze your saved notes or answer general questions like ChatGPT."
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isOpen) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const question = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setLoading(true);

        try {
            const response = await api.post('/ask-brain', {
                question
            });

            const data = response.data;

            setMessages(prev => [...prev, {
                role: 'ai',
                content: data.answer,
                sources: data.suggestedContent
            }]);

        } catch (error) {
            console.error("AI Error:", error);
            const errorMessage = error.response?.data?.error || error.message || "Sorry, I had trouble thinking about that. Please try again later.";
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Error: ${errorMessage}. Please check your API key or try again.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-gray-900 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 z-[100] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-100">Ask Brain</h3>
                        <p className="text-xs text-gray-400">Powered by your knowledge base</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            ${msg.role === 'ai' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-gray-700 text-gray-300'}
                        `}>
                            {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`
                                p-3.5 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}
                            `}>
                                {msg.role === 'ai' ? (
                                    <div className="markdown-content space-y-2">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-indigo-300 hover:underline" {...props} />,
                                                code: ({ node, inline, ...props }) =>
                                                    inline
                                                        ? <code className="bg-gray-900/50 px-1 py-0.5 rounded text-xs font-mono text-indigo-300" {...props} />
                                                        : <code className="block bg-gray-900/50 p-2 rounded-lg text-xs font-mono text-indigo-300 overflow-x-auto my-2" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>

                            {/* Sources Section */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="ml-1 mt-1 space-y-2 w-full">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Sources Used
                                    </p>
                                    <div className="space-y-2">
                                        {msg.sources.map((source, idx) => (
                                            <a
                                                key={idx}
                                                href={source.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-indigo-500/30 rounded-xl transition-all group"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-xs font-medium text-gray-300 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                                        {source.title}
                                                    </h4>
                                                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 flex-shrink-0" />
                                                </div>
                                                {source.type && (
                                                    <span className="text-[10px] text-gray-500 capitalize mt-1 inline-block">
                                                        {source.type} • {Math.round((source.relevanceScore || 0) * 100)}% match
                                                    </span>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 border border-gray-700">
                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                            <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your content..."
                        className="w-full pl-4 pr-12 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
