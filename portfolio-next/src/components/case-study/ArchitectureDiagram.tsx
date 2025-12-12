"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Server, Smartphone, Cloud, Wifi, ArrowRight, Layers, Cpu } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Node = ({ icon: Icon, label, sub, x, y }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute flex flex-col items-start justify-between p-4 bg-slate-100 border border-slate-300 w-44 h-36 z-10 shadow-sm hover:shadow-md transition-shadow"
        style={{ left: x, top: y }}
    >
        <div className="w-full flex justify-between items-start">
            <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div>
            <div className="font-bold text-sm text-slate-900 leading-tight mb-1">{label}</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{sub}</div>
        </div>
    </motion.div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Connection = ({ start, end, label }: any) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 L0,0" fill="#94a3b8" />
                </marker>
            </defs>
            <motion.path
                d={`M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            {label && (
                <text x={(parseFloat(start[0]) + parseFloat(end[0])) / 2} y={(parseFloat(start[1]) + parseFloat(end[1])) / 2 - 8} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle" className="bg-slate-50">
                    {label}
                </text>
            )}
        </svg>
    );
};

export const ArchitectureDiagram = () => {
    return (
        <div className="relative w-full h-[500px] bg-white rounded-xl border border-slate-200 overflow-hidden select-none font-sans">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="absolute top-6 left-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">System Architecture</div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">Data Ingestion v2.0</div>
            </div>

            {/* Nodes */}
            <Node
                icon={Smartphone}
                label="Field App (PWA)"
                sub="Offline First"
                x="10%"
                y="35%"
            />

            <Node
                icon={Database}
                label="IndexedDB"
                sub="Local Persistence"
                x="15%"
                y="70%"
            />

            <Node
                icon={Wifi}
                label="Sync Engine"
                sub="Background Protocol"
                x="40%"
                y="35%"
            />

            <Node
                icon={Cloud}
                label="Firestore"
                sub="NoSQL Store"
                x="70%"
                y="15%"
            />

            <Node
                icon={Cpu}
                label="Cloud Functions"
                sub="Serverless Logic"
                x="70%"
                y="55%"
            />

            {/* Connections */}
            {/* Note: Coordinates are mostly simplified relative to the container */}
            <Connection start={["22%", "45%"]} end={["40%", "45%"]} label="JSON Payload" />
            <Connection start={["52%", "45%"]} end={["70%", "25%"]} label="TLS/SSL" />
            <Connection start={["80%", "33%"]} end={["80%", "55%"]} label="Trigger" />
            <Connection start={["22%", "70%"]} end={["22%", "53%"]} label="Cache" />
        </div>
    );
};
