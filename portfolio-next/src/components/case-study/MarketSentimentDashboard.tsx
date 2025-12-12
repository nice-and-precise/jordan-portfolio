"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Globe, Newspaper, Zap, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
        if (score > 60) return "text-emerald-500";
        if (score < 40) return "text-rose-500";
        return "text-amber-500";
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">

            {/* Header / Ticker */}
            <div className="bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Global Sentiment Feed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 uppercase">Live</span>
                </div>
            </div>

            <div className="bg-slate-950 border-b border-slate-800 py-2 px-4 flex items-center overflow-hidden whitespace-nowrap relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10" />

                <motion.div
                    animate={{ x: [0, -500] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex gap-8 items-center"
                >
                    {[...tickers, ...tickers, ...tickers].map((t, i) => (
                        <div key={i} className="flex gap-2 items-baseline border-r border-slate-800 pr-8 last:border-0">
                            <span className="font-bold text-sm text-slate-200">{t.symbol}</span>
                            <span className="font-mono text-sm text-slate-400">{t.price.toFixed(2)}</span>
                            <span className={`text-xs font-bold flex items-center ${t.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {Math.abs(t.change).toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">

                {/* Left Col: News Feed */}
                <div className="md:col-span-2 p-6 bg-slate-950">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Newspaper className="w-4 h-4" /> Market Intelligence
                    </h3>
                    <div className="space-y-4">
                        {news.map((item, index) => (
                            <div key={item.id} className="flex gap-4 items-start group cursor-pointer">
                                <span className="font-mono text-xs text-slate-600 mt-1">0{index + 1}</span>
                                <div className="flex-1 pb-4 border-b border-slate-900 group-last:border-0">
                                    <h4 className="text-sm text-slate-300 font-medium mb-1 group-hover:text-white transition-colors leading-snug">{item.headline}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex gap-2 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                                            <span>{item.source}</span>
                                            <span>•</span>
                                            <span>Just Now</span>
                                        </div>
                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.sentiment === 'positive' ? 'border-emerald-900 text-emerald-500 bg-emerald-950/30' :
                                            item.sentiment === 'negative' ? 'border-rose-900 text-rose-500 bg-rose-950/30' :
                                                'border-amber-900 text-amber-500 bg-amber-950/30'
                                            }`}>
                                            SCORE: {item.score}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Sentiment & Actions */}
                <div className="p-6 bg-slate-900/50 flex flex-col justify-between">

                    {/* Sentiment Gauge */}
                    <div className="text-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Market Mood</h3>
                        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="12" />
                                <motion.circle
                                    cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12"
                                    className={getSentimentColor(globalSentiment)}
                                    strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * globalSentiment) / 100}
                                    strokeLinecap="butt"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * globalSentiment) / 100 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold tracking-tighter ${getSentimentColor(globalSentiment)}`}>
                                    {Math.round(globalSentiment)}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Bullish</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-6 px-4 leading-relaxed">
                            Sentiment aggregation indicates strong buy pressure across tech sectors.
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded text-center">
                            <div className="text-xl font-bold text-slate-200 font-mono">24ms</div>
                            <div className="text-[10px] text-slate-600 uppercase font-bold mt-1">Latency</div>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded text-center">
                            <div className="text-xl font-bold text-slate-200 font-mono">12</div>
                            <div className="text-[10px] text-slate-600 uppercase font-bold mt-1">Sources</div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Disclaimer Footer */}
            <div className="bg-slate-950 border-t border-slate-800 py-3">
                <p className="text-[10px] text-slate-600 font-mono text-center">
                    * DISCLAIMER: Information for demonstration only and not considered factual.
                </p>
            </div>
        </div>
    );
};
