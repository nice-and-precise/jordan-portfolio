"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, TrendingUp, Users, Activity, Calendar, Globe, Building2 } from "lucide-react";

// --- Types ---
interface LocationData {
    id: string;
    city: string;
    country: string;
    coords: { x: number; y: number }; // Percentage relative to map container
    marketStatus: "growth" | "stable" | "volatile";
    metrics: {
        sentiment: number;
        volume: string;
        activeDeals: number;
    };
    report: string;
}

// --- Mock Data ---
const LOCATIONS: LocationData[] = [
    {
        id: "nyc",
        city: "New York",
        country: "USA",
        coords: { x: 28, y: 35 },
        marketStatus: "growth",
        metrics: { sentiment: 88, volume: "$4.2B", activeDeals: 156 },
        report: "North American equities showing strong resilience. Tech sector accumulation phase detected across major indices.",
    },
    {
        id: "ldn",
        city: "London",
        country: "UK",
        coords: { x: 48, y: 28 },
        marketStatus: "volatile",
        metrics: { sentiment: 45, volume: "£1.8B", activeDeals: 84 },
        report: "Post-regulatory adjustments causing short-term liquidity constraints in fintech markets.",
    },
    {
        id: "sgp",
        city: "Singapore",
        country: "SG",
        coords: { x: 78, y: 55 },
        marketStatus: "stable",
        metrics: { sentiment: 72, volume: "S$2.1B", activeDeals: 92 },
        report: "Strong institutional inflow into logistics and green energy bonds. Regional hub status reinforced.",
    },
    {
        id: "tok",
        city: "Tokyo",
        country: "JP",
        coords: { x: 85, y: 38 },
        marketStatus: "growth",
        metrics: { sentiment: 81, volume: "¥3.4T", activeDeals: 110 },
        report: "Manufacturing output exceeding forecasts. Yen stability attracting foreign direct investment.",
    }
];

export const GlobalMarketMap = () => {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative font-sans">

            {/* Toolbar */}
            <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex justify-between items-center backdrop-blur-sm z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Global Market Intelligence</h2>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Connection
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> GROWTH</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> STABLE</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> VOLATILE</div>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full aspect-[16/9] bg-[#090b10] overflow-hidden group">
                {/* Simulated Map Background (SVG Pattern for "Industrial" look) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        {/* Abstract Continents (Simplified for code-only demo) */}
                        <path d="M150 150 Q 250 50 400 150 T 800 150 T 1200 150" fill="none" stroke="#1e293b" strokeWidth="100" strokeLinecap="round" opacity="0.5" filter="blur(20px)" />
                    </svg>
                    {/* World Map Image Overlay - Assuming we have a dark map file, if not we use a colored div for fallback visual */}
                    <div className="absolute inset-0 bg-[#0f172a]" style={{ maskImage: 'radial-gradient(circle at center, transparent, black)' }}></div>
                </div>

                {/* Pins */}
                {LOCATIONS.map((loc) => (
                    <motion.button
                        key={loc.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedLocation(loc)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none"
                        style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                    >
                        {/* Ripple Effect */}
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-75 h-4 w-4 ${loc.marketStatus === 'growth' ? 'bg-emerald-500' :
                                loc.marketStatus === 'volatile' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></div>

                        {/* Pin Head */}
                        <div className={`relative h-4 w-4 rounded-full border-2 border-white shadow-lg ${loc.marketStatus === 'growth' ? 'bg-emerald-500' :
                                loc.marketStatus === 'volatile' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></div>

                        {/* Hover Tooltip */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-10 pointer-events-none">
                            {loc.city}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Popup / Drawer */}
            <AnimatePresence>
                {selectedLocation && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-y-0 right-0 w-full md:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-30 flex flex-col"
                    >
                        {/* Popup Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{selectedLocation.city}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <MapPin className="w-4 h-4" /> {selectedLocation.country}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLocation(null)}
                                className="text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Popup Content */}
                        <div className="p-6 space-y-8 overflow-y-auto flex-1">

                            {/* Date Stamp */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono">
                                <Calendar className="w-3 h-3" />
                                <span>SIMULATED DATE: DEC 12, 2025</span>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Sentiment
                                    </div>
                                    <div className="text-3xl font-bold text-white">{selectedLocation.metrics.sentiment}</div>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3" /> Volume
                                    </div>
                                    <div className="text-3xl font-bold text-white">{selectedLocation.metrics.volume}</div>
                                </div>
                            </div>

                            {/* Report Text */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">Regional Synthesis</h4>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    {selectedLocation.report}
                                </p>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    Automated correlation analysis suggests high probability of localized breakout events in the next 48 trading hours.
                                </p>
                            </div>

                            {/* Industry Layers */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">Industry Layers</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-950 border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-900/30 rounded text-blue-400"><Building2 className="w-4 h-4" /></div>
                                            <span className="text-slate-300">Commercial Real Estate</span>
                                        </div>
                                        <span className="text-emerald-400 font-mono">+2.4%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-950 border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-amber-900/30 rounded text-amber-400"><Users className="w-4 h-4" /></div>
                                            <span className="text-slate-300">Labor Markets</span>
                                        </div>
                                        <span className="text-amber-400 font-mono">-0.8%</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Legend/Instructions */}
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center justify-between"
                >
                    <div className="text-xs text-slate-400">
                        <span className="font-bold text-white">INTERACTIVE MODE:</span> Select a regional node to access granular performance metrics.
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
