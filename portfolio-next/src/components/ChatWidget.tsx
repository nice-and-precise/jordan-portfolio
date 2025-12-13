"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SiteSettings } from "@/lib/settings";
import { Project, Service } from "@/lib/data";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatWidgetProps {
    settings: SiteSettings;
    projects: Project[];
    services: Service[];
}

export default function ChatWidget({ settings, projects, services }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello. I am the digital twin of Jordan's operational knowledge. Ask me about his methodologies, technical architecture, or experience." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const performGenAI = async (userMsg: string, history: Message[]) => {
        if (!settings.googleApiKey) {
            throw new Error("API Key not configured.");
        }

        const genAI = new GoogleGenerativeAI(settings.googleApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build Context
        const context = `
            Identity: You are the digital AI assistant for Jordan, an Operational Strategist and Full-Stack Engineer.
            
            Mission: Answer questions about Jordan's experience, methodology, projects, and contact info. 
            Constraint: You MUST REFUSE to answer questions unrelated to Jordan, software engineering, operations, or this portfolio.
            
            Bio / About:
            ${settings.aboutBody1}
            ${settings.aboutBody2}
            ${settings.aboutBody3}
            
            Methodology:
            ${settings.methodologyTitle}: ${settings.methodologySubtitle}
            ${settings.methodologyBody}
            Stats: ${(settings.stats || []).map(s => `${s.label}: ${s.value}`).join(", ")}
            
            Projects (Case Studies):
            ${projects.map(p => `
            - Project: ${p.title} (${p.slug})
            - Role: ${p.role?.join(", ")}
            - Tech Stack: ${p.techStack?.join(", ")}
            - Impact: ${p.impact?.map(i => `${i.label}: ${i.value}`).join(", ")}
            - Overview: ${p.overview}
            `).join("\n")}
            
            Services:
            ${services.map(s => `- ${s.title}: ${s.description}`).join("\n")}
            
            Contact Info:
            Email: ${settings.contactEmail}
            LinkedIn: ${settings.linkedinUrl}
            GitHub: ${settings.githubUrl}
            
            Tone: Professional, direct, slightly technical but accessible. Use "We" or "Jordan" when referring to the human.
        `;

        const chat = model.startChat({
            history: history.slice(1).map(msg => ({ // Skip first welcome message if it's from assistant (actually generic history items)
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            })),
            systemInstruction: context,
        });

        const result = await chat.sendMessage(userMsg);
        return result.response.text();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await performGenAI(userMessage.content, messages);
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error(error);
            const errMsg = settings.googleApiKey ? "Connection interrupted. Please try again." : "AI Configuration missing (API Key).";
            setMessages(prev => [...prev, { role: "system", content: errMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-transform border border-white/20"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                                <Sparkles className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Operator A.I.</h3>
                                <p className="text-[10px] text-emerald-500 font-mono tracking-wide">ONLINE // INTERACTIVE</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-blue-600" : msg.role === "assistant" ? "bg-emerald-600" : "bg-red-900/50"
                                        }`}>
                                        {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    </div>

                                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${msg.role === "user"
                                        ? "bg-blue-600/20 text-blue-100 rounded-tr-none border border-blue-500/30"
                                        : msg.role === "assistant"
                                            ? "bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700"
                                            : "bg-red-900/20 text-red-200 border border-red-500/30"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded bg-emerald-600 flex-shrink-0 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about my experience..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-600 mt-2 text-center">
                                AI can make mistakes. Please verify important info.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
