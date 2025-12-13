"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, TrendingUp, Users, Activity, Calendar, Globe, Building2, Layers } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import MapWrapper with no SSR
const MapWrapper = dynamic(() => import("./MapWrapper"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#090b10] animate-pulse flex items-center justify-center text-slate-700">Loading Map Engine...</div>
});

// --- Types ---
interface LocationData {
    id: string;
    city: string;
    state: string;
    coords: [number, number]; // Lat, Lng
    marketStatus: "growth" | "stable" | "volatile";
    metrics: {
        sentiment: number;
        volume: string;
        activeDeals: number;
    };
    report: string;
    logistics?: {
        truckRate: number; // per mile
        railRate: number; // per mile
        distanceToPort: number; // miles
        nearestRailyard: string;
    }
}

interface RouteData {
    id: string;
    name: string;
    type: "rail" | "truck";
    coordinates: [number, number][];
    color: string;
}

interface RailyardData {
    id: string;
    name: string;
    city: string;
    coords: [number, number];
}

// --- Mock Data (USA Only) ---
const LOCATIONS: LocationData[] = [
    {
        id: "nyc",
        city: "New York",
        state: "NY",
        coords: [40.7128, -74.0060],
        marketStatus: "growth",
        metrics: { sentiment: 88, volume: "$4.2B", activeDeals: 156 },
        report: "North American equities showing strong resilience. Tech sector accumulation phase detected across major indices.",
    },
    {
        id: "sfo",
        city: "San Francisco",
        state: "CA",
        coords: [37.7749, -122.4194],
        marketStatus: "volatile",
        metrics: { sentiment: 65, volume: "$2.8B", activeDeals: 134 },
        report: "VC liquidity constraints easing in Silicon Valley. Biotech sector showing early breakout signals.",
    },
    {
        id: "chi",
        city: "Chicago",
        state: "IL",
        coords: [41.8781, -87.6298],
        marketStatus: "stable",
        metrics: { sentiment: 72, volume: "$1.9B", activeDeals: 92 },
        report: "Midwest manufacturing output exceeding forecasts. Logistics hub processing volume at all-time high.",
        logistics: { truckRate: 3.45, railRate: 1.65, distanceToPort: 1200, nearestRailyard: "Chicago Gateway" }
    },
    {
        id: "atx",
        city: "Austin",
        state: "TX",
        coords: [30.2672, -97.7431],
        marketStatus: "growth",
        metrics: { sentiment: 81, volume: "$1.4B", activeDeals: 110 },
        report: "Sun Belt migration continuing to drive commercial real estate demand. Tech corridor expansion steady.",
        logistics: { truckRate: 2.95, railRate: 1.45, distanceToPort: 160, nearestRailyard: "Houston Terminal" }
    },
    // New Upper Midwest / Logistics Nodes
    {
        id: "msp",
        city: "Minneapolis",
        state: "MN",
        metrics: { sentiment: 75, volume: "$2.1B", activeDeals: 85 },
        coords: [44.9778, -93.2650],
        marketStatus: "stable",
        report: "Key logistics distribution center for Upper Midwest. Millwork demand stable.",
        logistics: { truckRate: 3.20, railRate: 1.50, distanceToPort: 1400, nearestRailyard: "Union Pacific Twin Cities" }
    },
    {
        id: "dsm",
        city: "Des Moines",
        state: "IA",
        metrics: { sentiment: 68, volume: "$950M", activeDeals: 42 },
        coords: [41.5868, -93.6250],
        marketStatus: "stable",
        report: "Ag-tech and insurance sector resilience. Freight volume moderate.",
        logistics: { truckRate: 3.10, railRate: 1.55, distanceToPort: 1550, nearestRailyard: "Des Moines Intermodal" }
    },
    {
        id: "mad",
        city: "Madison",
        state: "WI",
        metrics: { sentiment: 70, volume: "$820M", activeDeals: 38 },
        coords: [43.0731, -89.4012],
        marketStatus: "growth",
        report: "Regional tech hub expansion. Construction materials demand increasing.",
        logistics: { truckRate: 3.30, railRate: 1.60, distanceToPort: 1300, nearestRailyard: "Milwaukee Yard" }
    },
    {
        id: "boi",
        city: "Boise",
        state: "ID",
        metrics: { sentiment: 78, volume: "$1.1B", activeDeals: 55 },
        coords: [43.6150, -116.2023],
        marketStatus: "growth",
        report: "Rapid population growth driving housing market. Materials transport critical.",
        logistics: { truckRate: 3.50, railRate: 1.70, distanceToPort: 450, nearestRailyard: "Nampa Yard" }
    }
];

// Mock Routes (Approximate Paths)
const ROUTES: RouteData[] = [
    // Seattle -> Minneapolis (Rail)
    {
        id: "r-sea-msp",
        name: "Northern Transcon (Rail)",
        type: "rail",
        color: "#64748b", // Slate 500
        coordinates: [
            [47.6062, -122.3321], // Seattle
            [47.65, -117.42], // Spokane
            [46.87, -113.99], // Missoula
            [45.78, -108.50], // Billings
            [46.80, -100.78], // Bismarck
            [46.87, -96.78], // Fargo
            [44.9778, -93.2650] // Minneapolis
        ]
    },
    // Seattle -> Minneapolis (Truck - I-90/I-94)
    {
        id: "t-sea-msp",
        name: "I-90 Corridor (Freight)",
        type: "truck",
        color: "#f97316", // Orange 500
        coordinates: [
            [47.6062, -122.3321],
            [47.06, -120.52], // Ellensburg
            [47.67, -116.70], // Coeur d'Alene
            [45.67, -111.04], // Bozeman
            [44.08, -103.23], // Rapid City
            [43.54, -96.73], // Sioux Falls
            [44.9778, -93.2650]
        ]
    },
    // Houston -> Minneapolis (Rail)
    {
        id: "r-hou-msp",
        name: "Central Corridor (Rail)",
        type: "rail",
        color: "#64748b",
        coordinates: [
            [29.7604, -95.3698], // Houston
            [32.77, -96.79], // Dallas
            [35.46, -97.51], // OKC
            [37.68, -97.33], // Wichita
            [39.09, -94.57], // KC
            [41.58, -93.62], // Des Moines
            [44.9778, -93.2650] // Minneapolis
        ]
    },
    // Houston -> Minneapolis (Truck)
    {
        id: "t-hou-msp",
        name: "I-35 NAFTA Hall (Freight)",
        type: "truck",
        color: "#f97316",
        coordinates: [
            [29.7604, -95.3698],
            [30.26, -97.74], // Austin
            [32.75, -97.33], // Fort Worth
            [37.68, -97.33], // Wichita
            [41.58, -93.62], // Des Moines
            [43.14, -93.20], // Mason City
            [44.9778, -93.2650]
        ]
    }
];

const RAILYARDS: RailyardData[] = [
    { id: "ry-spo", name: "Spokane Yard", city: "Spokane, WA", coords: [47.6588, -117.4260] },
    { id: "ry-bil", name: "Billings Terminal", city: "Billings, MT", coords: [45.7833, -108.5007] },
    { id: "ry-far", name: "Fargo Intermodal", city: "Fargo, ND", coords: [46.8772, -96.7898] },
    { id: "ry-kc", name: "Kansas City Hub", city: "Kansas City, MO", coords: [39.0997, -94.5786] },
    { id: "ry-msp", name: "Twin Cities Intermodal", city: "Minneapolis, MN", coords: [44.9778, -93.2650] },
];

export const GlobalMarketMap = () => {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [layerStyle, setLayerStyle] = useState<"dark" | "satellite">("dark");

    const handleLocationSelect = (id: string) => {
        const loc = LOCATIONS.find(l => l.id === id) || null;
        setSelectedLocation(loc);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl relative font-sans">

            {/* Header / Toolbar */}
            <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex justify-between items-center backdrop-blur-sm z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">US Market Intelligence <span className="text-slate-500 font-normal">v2.5.0</span></h2>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Connection Active
                        </div>
                    </div>
                </div>

                {/* Layer Control + Legend */}
                <div className="flex gap-4 items-center">
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => setLayerStyle("dark")}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 border transition-all ${layerStyle === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            <Layers className="w-3 h-3" /> Dark
                        </button>
                        <button
                            onClick={() => setLayerStyle("satellite")}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 border transition-all ${layerStyle === 'satellite' ? 'bg-indigo-900/50 text-indigo-200 border-indigo-500/50' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            <Globe className="w-3 h-3" /> Satellite
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-800 hidden md:block" />

                    <div className="hidden md:flex gap-6 text-xs font-mono text-slate-400">
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
            </div>

            <div className="flex flex-col lg:flex-row h-[600px] relative">

                {/* Main Map Area */}
                <div className="relative flex-1 bg-[#090b10] overflow-hidden group border-r border-slate-900 z-0">
                    <MapWrapper
                        locations={LOCATIONS}
                        routes={ROUTES}
                        railyards={RAILYARDS}
                        selectedId={selectedLocation?.id || null}
                        onSelect={handleLocationSelect}
                        layerStyle={layerStyle}
                    />
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


                                {/* Logistics Analysis */}
                                {selectedLocation.logistics && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">Logistics Intelligence</h4>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                                <div className="text-slate-500 mb-1">Freight (Avg)</div>
                                                <div className="text-emerald-400 font-mono text-lg">${selectedLocation.logistics.truckRate}<span className="text-[10px] text-slate-600">/mi</span></div>
                                            </div>
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                                <div className="text-slate-500 mb-1">Rail (Est)</div>
                                                <div className="text-blue-400 font-mono text-lg">${selectedLocation.logistics.railRate}<span className="text-[10px] text-slate-600">/mi</span></div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-slate-400">Nearest Hub</span>
                                                <span className="text-white text-right">{selectedLocation.logistics.nearestRailyard}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Dist. to Port</span>
                                                <span className="text-white text-right">{selectedLocation.logistics.distanceToPort} mi</span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-lg bg-indigo-900/20 border border-indigo-500/30">
                                            <div className="flex items-start gap-2">
                                                <Activity className="w-4 h-4 text-indigo-400 mt-0.5" />
                                                <div>
                                                    <div className="text-xs font-bold text-indigo-300 mb-1">Fleet Commander Note</div>
                                                    <p className="text-[10px] text-indigo-200 leading-normal">
                                                        Major congestion alerts for I-80/I-90 interchange. Recommend routing bulk shipments via Northern Rail Corridor to avoid 4hr+ delays.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Disclaimer Footer */}
                                <div className="mt-6 border-t border-slate-800/50 pt-4">
                                    <p className="text-[10px] text-slate-600 font-mono text-center">
                                        * DISCLAIMER: Information for demonstration only and not considered factual.
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    )
                    }
                </AnimatePresence >

                {/* Bottom Legend/Instructions */}
                < div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none" >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex items-center justify-between pointer-events-auto"
                    >
                        <div className="text-xs text-slate-400">
                            <span className="font-bold text-white">INTERACTIVE MODE:</span> Use mouse to PAN and SCROLL to ZOOM. Select a node for details.
                        </div>
                    </motion.div>
                </div >
            </div >
        </div >
    );
};
