"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, TrendingUp, Users, Activity, Calendar, Globe, Building2 } from "lucide-react";

// --- Types ---
interface LocationData {
    id: string;
    city: string;
    state: string;
    coords: { x: number; y: number }; // Percentage relative to map container
    marketStatus: "growth" | "stable" | "volatile";
    metrics: {
        sentiment: number;
        volume: string;
        activeDeals: number;
    };
    report: string;
}

// --- Mock Data (USA Only) ---
const LOCATIONS: LocationData[] = [
    {
        id: "nyc",
        city: "New York",
        state: "NY",
        coords: { x: 82, y: 35 },
        marketStatus: "growth",
        metrics: { sentiment: 88, volume: "$4.2B", activeDeals: 156 },
        report: "North American equities showing strong resilience. Tech sector accumulation phase detected across major indices.",
    },
    {
        id: "sfo",
        city: "San Francisco",
        state: "CA",
        coords: { x: 12, y: 45 },
        marketStatus: "volatile",
        metrics: { sentiment: 65, volume: "$2.8B", activeDeals: 134 },
        report: "VC liquidity constraints easing in Silicon Valley. Biotech sector showing early breakout signals.",
    },
    {
        id: "chi",
        city: "Chicago",
        state: "IL",
        coords: { x: 65, y: 38 },
        marketStatus: "stable",
        metrics: { sentiment: 72, volume: "$1.9B", activeDeals: 92 },
        report: "Midwest manufacturing output exceeding forecasts. Logistics hub processing volume at all-time high.",
    },
    {
        id: "atx",
        city: "Austin",
        state: "TX",
        coords: { x: 48, y: 75 },
        marketStatus: "growth",
        metrics: { sentiment: 81, volume: "$1.4B", activeDeals: 110 },
        report: "Sun Belt migration continuing to drive commercial real estate demand. Tech corridor expansion steady.",
    }
];

export const GlobalMarketMap = () => {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative font-sans">

            {/* Header / Toolbar */}
            <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex justify-between items-center backdrop-blur-sm z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">US Market Intelligence <span className="text-slate-500 font-normal">v2.4.0</span></h2>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Connection Active
                        </div>
                    </div>
                </div>
                {/* Status Indicators */}
                <div className="hidden md:flex gap-6 text-xs font-mono text-slate-400 bg-slate-900/50 py-2 px-4 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        GROWTH
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        STABLE
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        VOLATILE
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[600px]">

                {/* Main Map Area */}
                <div className="relative flex-1 bg-[#090b10] overflow-hidden group border-r border-slate-900">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/grid-pattern.svg')]"></div>

                    {/* USA Map SVG - Enhanced Visibility */}
                    <div className="absolute inset-0 p-12 flex items-center justify-center opacity-80 pointer-events-none select-none">
                        <svg viewBox="0 0 960 600" className="w-full h-full text-slate-800/50 fill-slate-900/50 stroke-slate-700 stroke-[1.5] drop-shadow-2xl">
                            <path d="M936.8,118.8 c-0.3-0.3-0.7-0.5-1.2-0.6 c-2.3-0.5-4.5-1.1-6.7-1.8 c-1.1-0.3-2.3-0.8-3.3-1.4 c-2.7-1.5-5.3-3.1-7.9-4.7 c-0.6-0.3-1.1-0.8-1.5-1.4 c-1.6-2.1-3.2-4.1-4.9-6.2 c-0.8-1-1.7-1.9-2.7-2.7 c-1.8-1.4-3.7-2.6-5.8-3.7 c-0.9-0.5-1.9-0.9-2.9-1.2 c-2.7-0.8-5.3-1.8-7.9-2.8 c-1-0.4-2-0.9-3-1.5 c-3.5-2-7.1-3.7-10.9-5.1 c-1.5-0.5-3-1.2-4.4-1.9 c-3.2-1.6-6.4-3.2-9.6-4.6 c-1.7-0.7-3.4-1.6-5.1-2.4 c-2.1-1-4.2-2.1-6.3-3.1 c-1.3-0.6-2.6-1.1-3.9-1.6 c-2.5-0.9-5-1.8-7.5-2.6 c-1.2-0.4-2.4-0.9-3.5-1.5 c-2.1-1.1-4.1-2.3-6.2-3.4 c-1.7-0.9-3.4-1.9-5-3 c-1.2-0.8-2.6-1.4-3.9-2 c-2.1-0.9-4.2-1.8-6.3-2.6 c-1.8-0.7-3.6-1.4-5.4-2.1 c-2.5-1-5.1-1.8-7.7-2.6 c-1.4-0.4-2.9-0.7-4.3-1 c-3.1-0.6-6.3-1.2-9.4-1.6 c-1.6-0.2-3.3-0.3-4.9-0.3 c-3.2,0.1-6.3,0.3-9.5,0.7 c-1.6,0.2-3.2,0.6-4.7,1.1 c-2.9,0.9-5.7,2.1-8.5,3.3 c-1.4,0.6-2.7,1.4-4,2.2 c-2.1,1.3-4.2,2.7-6.2,4.1 c-0.9,0.6-1.8,1.3-2.6,2.1 c-1.5,1.3-2.8,2.7-4.1,4.2 c-0.6,0.8-1.4,1.4-2.1,2.1 c-2,1.9-4,3.8-5.9,5.7 c-0.9,0.9-1.7,1.8-2.5,2.8 c-1.4,1.7-2.6,3.6-3.8,5.4 c-0.5,0.8-1,1.6-1.3,2.5 c-1,2.4-1.7,4.9-2.3,7.4 c-0.3,1.3-0.7,2.5-1.2,3.7 c-1.1,2.7-2.4,5.4-3.8,8 c-0.6,1.1-1.3,2.2-2.1,3.2 c-1.5,1.8-3.2,3.5-4.9,5.2 c-0.8,0.8-1.5,1.7-2.2,2.6 c-1.3,1.7-2.5,3.4-3.7,5.2 c-0.5,0.8-1,1.6-1.4,2.5 c-1,2.2-1.8,4.5-2.6,6.7 c-0.3,1-0.7,1.9-1.2,2.8 c-1.1,2.1-2.4,4.2-3.6,6.2 c-0.6,1-1.3,1.9-2,2.8 c-1.5,1.9-3.2,3.7-4.8,5.5 c-0.8,0.9-1.5,1.9-2.1,2.9 c-1.4,2.3-2.6,4.7-3.8,7.2 c-0.4,0.9-0.8,1.7-1.4,2.6 c-1.2,2-2.6,3.9-4,5.8 c-0.7,0.9-1.4,1.8-2.2,2.6 c-1.8,1.9-3.7,3.6-5.8,5.3 c-0.9,0.7-1.9,1.3-2.9,1.9 c-2.4,1.4-4.9,2.7-7.4,3.8 c-1.3,0.6-2.5,1.3-3.8,1.9 c-2.7,1.4-5.4,2.6-8.2,3.7 c-1.3,0.5-2.6,1-4,1.3 c-2.7,0.7-5.5,1.2-8.3,1.5 c-1.5,0.2-3,0.2-4.5,0.1 c-3.2-0.2-6.3-0.6-9.5-1.2 c-1.5-0.3-3-0.8-4.5-1.4 c-2.8-1.1-5.6-2.4-8.3-3.9 c-1.2-0.7-2.4-1.5-3.5-2.4 c-2.4-1.9-4.7-4-6.9-6.2 c-0.9-0.9-1.8-1.9-2.5-2.9 c-1.7-2.3-3.1-4.8-4.5-7.3 c-0.5-1-1.1-1.9-1.7-2.8 c-1.4-2.1-3-4.1-4.6-6.1 c-0.8-0.9-1.6-1.8-2.5-2.6 c-1.9-1.7-4-3.3-6.1-4.7 c-1-0.7-2-1.3-3.1-1.9 c-2.5-1.3-5.1-2.4-7.7-3.2 c-1.3-0.4-2.6-0.7-3.9-0.9 c-2.8-0.4-5.6-0.6-8.5-0.6 c-1.4,0-2.9,0.2-4.3,0.5 c-3.1,0.6-6.2,1.5-9.2,2.7 c-1.4,0.6-2.8,1.3-4.1,2.1 c-2.7,1.6-5.3,3.5-7.7,5.5 c-1.1,0.9-2.1,1.9-3,2.9 c-2.1,2.3-4,4.9-5.7,7.6 c-0.7,1.1-1.3,2.2-1.9,3.4 c-1.3,2.6-2.4,5.3-3.2,8.1 c-0.3,1-0.6,2-0.8,3 c-0.6,3-0.9,6-0.9,9.1 c0,1.5,0.1,3,0.4,4.5 c0.5,2.7,1.2,5.3,2.2,7.9 c0.4,1.1,0.9,2.1,1.5,3.1 c1.3,2.3,2.8,4.5,4.5,6.5 c0.8,1,1.7,1.9,2.6,2.8 c2.2,2.1,4.6,3.9,7.1,5.5 c1.2,0.8,2.4,1.4,3.7,2 c2.6,1.2,5.3,2.1,8.1,2.8 c1.3,0.3,2.7,0.5,4.1,0.5 c2.9,0.1,5.8-0.1,8.6-0.6 c1.4-0.3,2.8-0.7,4.1-1.3 c2.7-1.1,5.3-2.5,7.8-4.1 c1.1-0.7,2.2-1.6,3.2-2.5 c2.2-2,4.2-4.2,6-6.6 c0.8-1,1.5-2.1,2.2-3.2 c1.4-2.4,2.5-4.9,3.5-7.5 c0.4-1.1,0.7-2.2,1-3.4 c0.8-2.8,1.3-5.7,1.6-8.6 c0.1-1.2,0.2-2.4,0.1-3.6 c-0.1-3.1-0.5-6.2-1.2-9.2 c-0.3-1.3-0.7-2.5-1.2-3.8 c-1.1-2.7-2.6-5.4-4.3-7.9 c-0.7-1.1-1.5-2.2-2.3-3.2 c-1.8-2.2-3.9-4.3-6.1-6.2 c-1-0.8-2-1.6-3.1-2.3 c-2.3-1.6-4.7-3-7.2-4.2 c-1.1-0.5-2.3-1-3.5-1.4 c-2.8-0.9-5.7-1.5-8.6-1.9 c-1.4-0.2-2.8-0.2-4.3-0.1 c-3.5,0.3-6.9,0.9-10.2,1.9 c-1.4,0.4-2.8,1-4.1,1.7 c-2.7,1.4-5.2,3.1-7.6,5 c-1,0.8-2,1.7-2.9,2.7 c-2,2.2-3.8,4.5-5.3,7 c-0.7,1-1.3,2.1-1.8,3.3 c-1.3,2.5-2.2,5.2-2.9,7.9 c-0.3,1.1-0.5,2.2-0.6,3.3 c-0.4,3-0.6,5.9-0.5,9 c0,1.2,0.1,2.4,0.4,3.6 c0.6,3,1.5,5.9,2.7,8.7 c0.5,1.1,1,2.2,1.6,3.3 c1.5,2.5,3.2,4.8,5,7 c0.9,1,1.8,2,2.8,2.8 c2.2,2,4.6,3.8,7.1,5.3 c1.1,0.7,2.3,1.3,3.5,1.9 c2.6,1.2,5.3,2.1,8,2.8 c1.3,0.3,2.7,0.5,4,0.7 c3,0.2,5.9,0.2,8.9-0.1 c1.4-0.2,2.8-0.4,4.2-0.8 c2.7-0.9,5.3-2,7.7-3.4 c1.1-0.6,2.2-1.3,3.1-2.1 c2-1.6,3.9-3.5,5.6-5.4 c0.8-0.9,1.5-1.9,2.1-2.9 c1.3-2.2,2.5-4.5,3.4-6.8 c0.4-1,0.7-2.1,1-3.2 c0.7-2.6,1.2-5.3,1.4-8 c0.1-1.2,0.1-2.3,0-3.5 c-0.2-3.1-0.6-6.3-1.3-9.3 c-0.3-1.2-0.7-2.4-1.2-3.6 c-1.2-2.5-2.7-5-4.4-7.3 c-0.7-1-1.6-1.9-2.4-2.8 c-1.9-1.9-3.9-3.8-6-5.4 c-1-0.7-2-1.4-3.1-2 c-2.4-1.4-4.9-2.5-7.4-3.4 c-1.1-0.4-2.3-0.8-3.5-1 c-2.9-0.6-5.8-0.9-8.7-0.9 c-1.4,0-2.8,0.1-4.2,0.3 c-3.3,0.6-6.5,1.4-9.6,2.5 c-1.4,0.5-2.7,1.1-4,1.8 c-2.6,1.5-5.1,3.3-7.4,5.3 c-1,0.9-1.9,1.8-2.8,2.8 c-1.9,2.2-3.7,4.6-5.2,7.1 c-0.7,1.1-1.3,2.2-1.8,3.4 c-1.2,2.6-2.1,5.3-2.8,8 c-0.3,1.1-0.5,2.2-0.6,3.4 c-0.3,2.9-0.4,5.9-0.2,8.9 c0.1,1.2,0.2,2.5,0.5,3.7 c0.7,2.9,1.7,5.7,3,8.4 c0.5,1.1,1.1,2.2,1.8,3.2 c1.6,2.4,3.5,4.6,5.4,6.7 c0.9,1,1.9,1.9,2.9,2.7 c2.2,1.9,4.7,3.6,7.2,4.9 c1.2,0.6,2.4,1.2,3.6,1.7 c2.6,1,5.4,1.8,8.1,2.3 c1.3,0.2,2.7,0.4,4.1,0.5 c3,0.1,6,0,8.9-0.4 c1.4-0.2,2.8-0.5,4.2-0.9 c2.6-1,5.2-2.2,7.6-3.7 c1-0.7,2.1-1.4,3-2.2 c1.9-1.7,3.6-3.7,5.2-5.7 c0.7-0.9,1.4-1.9,2-3 c1.2-2.2,2.2-4.6,3-7 c0,0,0.1,0,0.1,0.1 c1.1,5,2.5,9.8,4.1,14.6 c0.5,1.5,1,3,1.6,4.5 c1.3,3.5,2.7,6.9,4.2,10.3 c0.6,1.4,1.3,2.8,2,4.2 c1.6,3.3,3.3,6.5,5.2,9.7 c0.8,1.3,1.6,2.6,2.5,3.9 c2.1,3,4.3,6,6.7,8.8 c1,1.1,2,2.3,3.1,3.4 c2.6,2.7,5.4,5.2,8.3,7.6 c1.2,1,2.5,2,3.7,2.9 c2.5,1.8,5.1,3.4,7.8,4.9 c0.6,0.3,1.3,0.8,1.9,1.1 c3,1.5,6,2.8,9.2,3.9 c0.7,0.3,1.4,0.5,2.1,0.8 c3.6,1.2,7.2,2.1,10.9,2.9 c0.4,0.1,0.9,0.2,1.3,0.2 c5.4,0.9,10.8,1.3,16.3,1.2 c1.6,0,3.1-0.1,4.7-0.3 c2.1-0.2,4.2-0.5,6.3-0.9 c-1.7-1.1-3.3-2.3-4.8-3.6 c-2.6-2.1-5-4.5-7.3-6.9 c-3.9-4.2-7.3-8.8-10.2-13.8 c-2.2-3.8-4-7.8-5.5-12 c-0.6-1.7-1.2-3.5-1.7-5.2 c-0.9-3-1.6-6-2.1-9.1 c-0.2-1.7-0.3-3.3-0.4-5 c-0.2-3.1-0.2-6.2,0.1-9.3 c0.1-1.6,0.2-3.1,0.4-4.7 c0.5-3.1,1.3-6.1,2.4-9 c0.5-1.2,1-2.5,1.6-3.7 c1.4-2.8,3-5.5,4.9-8 c0.9-1.2,1.9-2.3,2.9-3.4 c2.3-2.3,4.9-4.4,7.7-6.2 c1.3-0.8,2.7-1.6,4.1-2.3" stroke="currentColor" fill="none" transform="translate(100, 50) scale(0.8)" />
                        </svg>
                    </div>

                    {/* World Map Background (Faint) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/grid-pattern.svg')]"></div>

                    {/* Pins */}
                    {LOCATIONS.map((loc) => (
                        <motion.button
                            key={loc.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setSelectedLocation(loc)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none z-10"
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
                                        <MapPin className="w-4 h-4" /> {selectedLocation.state}, USA
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
