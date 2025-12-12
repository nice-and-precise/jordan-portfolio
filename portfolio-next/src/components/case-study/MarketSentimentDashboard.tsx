"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Globe, Newspaper, Zap, Activity } from "lucide-react";

// --- Types ---
interface Ticker {
    symbol: string;
    price: number;
    change: number;
}

interface NewsItem {
    id: number;
    headline: string;
    sentiment: "positive" | "negative" | "neutral";
    score: number; // 0-100
    source: string;
}

// --- Mock Data ---
const INITIAL_TICKERS: Ticker[] = [
    { symbol: "AAPL", price: 185.92, change: 1.2 },
    { symbol: "GOOGL", price: 142.55, change: -0.4 },
    { symbol: "MSFT", price: 402.10, change: 0.8 },
    { symbol: "TSLA", price: 190.50, change: -2.1 },
    { symbol: "NVDA", price: 720.00, change: 3.5 },
];

const NEWS_FEED: NewsItem[] = [
    { id: 1, headline: "Tech sector rallies on AI breakthroughs", sentiment: "positive", score: 85, source: "Reuters" },
    { id: 2, headline: "Supply chain disruptions affect global logistics", sentiment: "negative", score: 40, source: "Bloomberg" },
    { id: 3, headline: "Fed maintains interest rates steady", sentiment: "neutral", score: 50, source: "CNBC" },
    { id: 4, headline: "Emerging markets show strong growth potential", sentiment: "positive", score: 78, source: "WSJ" },
];

export const MarketSentimentDashboard = () => {
    const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
    const [news, setNews] = useState<NewsItem[]>(NEWS_FEED);
    const [globalSentiment, setGlobalSentiment] = useState(65); // 0-100

    // --- Simulation ---
    useEffect(() => {
        const interval = setInterval(() => {
            // Update prices randomly
            setTickers(prev => prev.map(t => ({
                ...t,
                price: t.price + (Math.random() - 0.5) * 0.5,
                change: t.change + (Math.random() - 0.5) * 0.1
            })));

            // Drift sentiment
            setGlobalSentiment(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));

        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // --- Sentiment Gauge Color ---
    const getSentimentColor = (score: number) => {
        if (score > 60) return "text-emerald-400 border-emerald-500/50";
        if (score < 40) return "text-red-400 border-red-500/50";
        return "text-yellow-400 border-yellow-500/50";
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">

            {/* Top Bar: Ticker Marquee */}
            <div className="bg-slate-950 border-b border-slate-800 py-2 px-4 flex items-center overflow-hidden whitespace-nowrap relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10" />

                <motion.div
                    animate={{ x: [0, -500] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex gap-8 items-center"
                >
                    {[...tickers, ...tickers, ...tickers].map((t, i) => (
                        <div key={i} className="flex gap-2 items-baseline">
                            <span className="font-mono text-xs font-bold text-slate-300">{t.symbol}</span>
                            <span className="font-mono text-xs text-white">{t.price.toFixed(2)}</span>
                            <span className={`text-[10px] font-mono ${t.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">

                {/* Left Col: News Feed */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Newspaper className="w-4 h-4" /> Live Intelligence
                    </h3>
                    <div className="grid gap-3">
                        {news.map(item => (
                            <div key={item.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg flex justify-between items-start group hover:bg-slate-800/60 transition-colors cursor-pointer">
                                <div>
                                    <h4 className="text-sm text-slate-200 font-medium mb-1 group-hover:text-indigo-300 transition-colors">{item.headline}</h4>
                                    <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                        <span>{item.source}</span>
                                        <span>•</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded bg-black/20 ${item.sentiment === 'positive' ? 'text-emerald-400' : item.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {item.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Sentiment & Actions */}
                <div className="space-y-6">

                    {/* Sentiment Gauge */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 absolute top-4 left-4">Market Mood</h3>

                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Outer Circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="8" />
                                <motion.circle
                                    cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8"
                                    className={getSentimentColor(globalSentiment).split(' ')[0]}
                                    strokeDasharray="351"
                                    strokeDashoffset={351 - (351 * globalSentiment) / 100}
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 351 }}
                                    animate={{ strokeDashoffset: 351 - (351 * globalSentiment) / 100 }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={`text-3xl font-bold ${getSentimentColor(globalSentiment).split(' ')[0]}`}>
                                    {Math.round(globalSentiment)}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase">BULLISH</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-indigo-900/10 border border-indigo-500/20 p-3 rounded-lg">
                            <Zap className="w-5 h-5 text-indigo-400 mb-2" />
                            <div className="text-2xl font-bold text-white">4ms</div>
                            <div className="text-[10px] text-slate-400 uppercase">Latency</div>
                        </div>
                        <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-lg">
                            <Globe className="w-5 h-5 text-purple-400 mb-2" />
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-[10px] text-slate-400 uppercase">Markets</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
