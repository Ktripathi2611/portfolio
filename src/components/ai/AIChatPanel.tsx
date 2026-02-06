"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { behaviorTracker } from "@/lib/ai/BehaviorTracker";
import { aiResponseEngine } from "@/lib/ai/AIResponseEngine";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: number;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const profile = behaviorTracker.analyzeUser();
            const isReturning = behaviorTracker.isReturningVisitor();
            const response = aiResponseEngine.generateResponse(profile, isReturning);

            setTimeout(() => {
                setMessages([
                    {
                        id: "greeting",
                        text: response.greeting,
                        sender: "ai",
                        timestamp: Date.now(),
                    },
                ]);
            }, 500);
        }
    }, [isOpen, messages.length]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: inputValue,
            sender: "user",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const profile = behaviorTracker.analyzeUser();
            const aiText = aiResponseEngine.processMessage(inputValue, profile);

            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                text: aiText,
                sender: "ai",
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const profile = behaviorTracker.analyzeUser();
    const suggestions = aiResponseEngine.generateSuggestions(profile);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-4 bottom-24 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
                        style={{
                            backgroundColor: "rgba(15, 15, 25, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            maxHeight: "70vh",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between p-4"
                            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                                    }}
                                >
                                    <span className="text-lg">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">AI Assistant</h3>
                                    <p className="text-xs text-white/50">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            >
                                <FaTimes className="w-4 h-4 text-white/70" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="p-4 overflow-y-auto"
                            style={{ height: "300px" }}
                        >
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className="max-w-[80%] rounded-2xl px-4 py-2"
                                            style={{
                                                backgroundColor:
                                                    msg.sender === "user"
                                                        ? "rgba(0, 212, 255, 0.2)"
                                                        : "rgba(255, 255, 255, 0.1)",
                                                border:
                                                    msg.sender === "user"
                                                        ? "1px solid rgba(0, 212, 255, 0.3)"
                                                        : "1px solid rgba(255, 255, 255, 0.1)",
                                            }}
                                        >
                                            <p className="text-sm text-white/90">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div
                                            className="rounded-2xl px-4 py-2"
                                            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                        >
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInputValue(suggestion)}
                                            className="text-xs px-3 py-1.5 rounded-full transition-colors"
                                            style={{
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                color: "rgba(255, 255, 255, 0.7)",
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div
                            className="p-4"
                            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                        >
                            <div
                                className="flex items-center gap-2 rounded-xl px-4 py-2"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                    style={{
                                        background: inputValue.trim()
                                            ? "linear-gradient(135deg, #00d4ff, #a855f7)"
                                            : "rgba(255, 255, 255, 0.1)",
                                        opacity: inputValue.trim() ? 1 : 0.5,
                                    }}
                                >
                                    <FaPaperPlane className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
