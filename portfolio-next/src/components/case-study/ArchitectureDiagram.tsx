"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Server, Smartphone, Cloud, Wifi, ArrowRight } from "lucide-react";

const Node = ({ icon: Icon, label, sub, color, x, y }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`absolute flex flex-col items-center justify-center p-4 rounded-2xl border backdrop-blur-md w-40 h-32 md:w-48 md:h-40 z-10 ${color}`}
        style={{ left: x, top: y }}
    >
        <div className="mb-3 p-3 rounded-full bg-black/20">
            <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="text-center">
            <div className="font-bold text-sm md:text-base text-white mb-1">{label}</div>
            <div className="text-[10px] md:text-xs text-white/60 font-mono">{sub}</div>
        </div>
    </motion.div>
);

const Connection = ({ start, end, label }: any) => {
    // Simple straight line logic for demo (can be enhanced)
    // Coordinates are percentages
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
            </defs>
            <motion.line
                x1={start[0]}
                y1={start[1]}
                x2={end[0]}
                y2={end[1]}
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            {label && (
                <text x={(parseFloat(start[0]) + parseFloat(end[0])) / 2} y={(parseFloat(start[1]) + parseFloat(end[1])) / 2 - 10} fill="#94a3b8" fontSize="10" textAnchor="middle">
                    {label}
                </text>
            )}
        </svg>
    );
};

export const ArchitectureDiagram = () => {
    return (
        <div className="relative w-full h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden select-none">
            <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                System Architecture v2.0
            </div>

            {/* Nodes */}
            <Node
                icon={Smartphone}
                label="Field App (PWA)"
                sub="Offline First"
                color="bg-emerald-900/20 border-emerald-500/30 text-emerald-400"
                x="10%"
                y="40%"
            />

            <Node
                icon={Database}
                label="IndexedDB"
                sub="Local Persistence"
                color="bg-slate-800/40 border-slate-700 text-slate-400"
                x="15%"
                y="75%"
            />

            <Node
                icon={Wifi}
                label="Sync Engine"
                sub="Background Sync"
                color="bg-indigo-900/20 border-indigo-500/30 text-indigo-400"
                x="40%"
                y="40%"
            />

            <Node
                icon={Cloud}
                label="Firestore"
                sub="Real-time NoSQL"
                color="bg-orange-900/20 border-orange-500/30 text-orange-400"
                x="70%"
                y="20%"
            />

            <Node
                icon={Server}
                label="Cloud Functions"
                sub="Payroll Logic"
                color="bg-blue-900/20 border-blue-500/30 text-blue-400"
                x="70%"
                y="60%"
            />

            {/* Connections */}
            {/* Note: Coordinates are mostly simplified relative to the container */}
            <Connection start={["20%", "50%"]} end={["40%", "50%"]} label="JSON" />
            <Connection start={["55%", "50%"]} end={["70%", "30%"]} label="WebSocket" />
            <Connection start={["75%", "40%"]} end={["75%", "60%"]} label="Triggers" />
            <Connection start={["20%", "72%"]} end={["20%", "60%"]} label="Cache" />
        </div>
    );
};
