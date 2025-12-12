"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Activity, Settings, RefreshCw } from "lucide-react";

// --- Types ---
interface DataPoint {
    id: number;
    value: number;
    timestamp: number;
}

// --- Helpers ---
const generateDataPoint = (mean: number, stdDev: number, index: number): DataPoint => {
    // Box-Muller transform for normal distribution
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return {
        id: index,
        value: mean + z * stdDev,
        timestamp: Date.now(),
    };
};

export const ManufacturingDefectChart = () => {
    // --- Configuration ---
    const TARGET = 10.0;
    const UCL = 10.5; // Upper Control Limit
    const LCL = 9.5;  // Lower Control Limit
    const WINDOW_SIZE = 30;

    const [data, setData] = useState<DataPoint[]>([]);
    const [isRunning, setIsRunning] = useState(true);
    // const [cpk, setCpk] = useState(1.33); // Derived now
    const [alerts, setAlerts] = useState<string[]>([]);
    const countRef = useRef(0);

    // --- Simulation Loop ---
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setData(prev => {
                const newPoint = generateDataPoint(TARGET, 0.15, countRef.current++);
                const newData = [...prev, newPoint].slice(-WINDOW_SIZE);

                // Check for Out of Control conditions
                if (newPoint.value > UCL || newPoint.value < LCL) {
                    setAlerts(a => [`Anomaly detected at ${new Date().toLocaleTimeString()}: ${newPoint.value.toFixed(3)}mm`, ...a].slice(0, 3));
                }

                return newData;
            });
        }, 800);

        return () => clearInterval(interval);
    }, [isRunning]);

    // --- Metrics Calculation ---
    // Recalculate Cpk based on window
    // --- Metrics Calculation ---
    const cpk = useMemo(() => {
        if (data.length < 5) return 1.33; // Default
        const values = data.map(d => d.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (values.length - 1));

        // CpK = min((USL - mean) / 3sigma, (mean - LSL) / 3sigma)
        const cpu = (UCL - mean) / (3 * stdDev);
        const cpl = (mean - LCL) / (3 * stdDev);
        return Math.min(cpu, cpl);
    }, [data, UCL, LCL]);

    // --- Rendering Helpers ---
    // Map value to Y coordinate (0-100%)
    const getY = (val: number) => {
        const range = UCL - LCL + 0.4; // Add padding
        const min = LCL - 0.2;
        const percent = ((val - min) / range) * 100;
        return 100 - Math.max(0, Math.min(100, percent));
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Real-Time SPC Monitor
                    </h3>
                    <p className="text-sm text-slate-400 font-mono mt-1">
                        Station: CNC-04 | Part: 0x29A-F
                    </p>
                </div>
                <div className="flex gap-4 text-right">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Cpk</div>
                        <div className={`text-2xl font-bold font-mono ${cpk < 1.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {cpk.toFixed(2)}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    >
                        {isRunning ? <Settings className="w-5 h-5 animate-spin-slow" /> : <RefreshCw className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64 w-full bg-slate-950/50 rounded-lg border border-slate-800 mb-6 overflow-hidden">

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 pointer-events-none opacity-20">
                    {[UCL, TARGET, LCL].map((val, i) => (
                        <div key={i} className="w-full border-t border-dashed border-slate-400 text-xs text-slate-500 relative" style={{ top: `${getY(val)}%`, position: 'absolute' }}>
                            <span className="absolute -top-3 right-0">{val.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* SVG Path */}
                <svg className="absolute inset-0 w-full h-full p-4 overflow-visible">
                    <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        points={data.map((d, i) => {
                            const x = (i / (WINDOW_SIZE - 1)) * 100; // Percentage width
                            const y = getY(d.value); // Percentage height
                            // Need to convert to px for SVG or use percentage coordinates? 
                            // SVG doesn't strictly support percentage points in polyline easily without viewBox magic.
                            // Let's use viewbox 0 0 100 100 and preserveAspectRatio="none"
                            return `${x},${y}`;
                        }).join(" ")}
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Dots */}
                    {data.map((d, i) => (
                        <circle
                            key={d.id}
                            cx={`${(i / (WINDOW_SIZE - 1)) * 100}%`}
                            cy={`${getY(d.value)}%`}
                            r="3"
                            className={d.value > UCL || d.value < LCL ? "fill-red-500 stroke-red-900" : "fill-indigo-400 stroke-slate-900"}
                            strokeWidth="1"
                        />
                    ))}
                </svg>
            </div>

            {/* Alerts Feed */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Anomalies</h4>
                <AnimatePresence>
                    {alerts.length === 0 ? (
                        <div className="text-sm text-slate-600 italic">System Nominal. Zero defects detected.</div>
                    ) : (
                        alerts.map((alert, i) => (
                            <motion.div
                                key={i} // simple key for demo
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300"
                            >
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                {alert}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 border-t border-slate-800 pt-6">
                <div>
                    <div className="text-xs text-slate-500">Mean</div>
                    <div className="font-mono font-bold text-white">{data.length ? (data.reduce((a, b) => a + b.value, 0) / data.length).toFixed(3) : "10.000"}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">Sigma</div>
                    <div className="font-mono font-bold text-white">0.15</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">Yield</div>
                    <div className="font-mono font-bold text-emerald-400">99.8%</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">Uptime</div>
                    <div className="font-mono font-bold text-blue-400">14d 2h</div>
                </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-6 border-t border-slate-800/50 pt-4">
                <p className="text-[10px] text-slate-600 font-mono text-center">
                    * DISCLAIMER: Information for demonstration only and not considered factual.
                </p>
            </div>

        </div>
    );
};
