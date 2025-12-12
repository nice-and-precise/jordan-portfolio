"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Database,
    Smartphone,
    Wifi,
    Cpu,
    Server,
    ArrowRight,
    Activity,
    Layers,
    Code2
} from "lucide-react";

export const ArchitectureDiagram = () => {
    return (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-8 md:p-12 relative font-sans">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                    <Layers className="w-3 h-3" />
                    Architecture v2.0
                </div>
                <h3 className="text-3xl font-bold text-white">Data Ingestion Pipeline</h3>
                <p className="text-slate-400 mt-2 max-w-2xl">
                    Offline-first synchronization protocol ensuring 99.9% data integrity across distributed field operations.
                </p>
            </div>

            {/* Flowchart Container */}
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between">

                {/* 1. Client Layer */}
                <div className="flex-1 w-full lg:w-auto relative group">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all duration-300 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">CLIENT</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Field Application</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            React Native PWA with local IndexedDB persistence for offline capability.
                        </p>
                    </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex flex-col items-center justify-center px-4 opacity-50">
                    <ArrowRight className="w-6 h-6 text-slate-500 rotate-90 lg:rotate-0" />
                    <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">WebSocket</span>
                </div>

                {/* 2. Sync Layer */}
                <div className="flex-1 w-full lg:w-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <Wifi className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded font-mono">MIDDLEWARE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Sync Engine</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Custom delta-resolution protocol handling merge conflicts and optimstic UI updates.
                        </p>
                    </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex flex-col items-center justify-center px-4 opacity-50">
                    <ArrowRight className="w-6 h-6 text-slate-500 rotate-90 lg:rotate-0" />
                    <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">REST/gRPC</span>
                </div>

                {/* 3. Data Layer */}
                <div className="flex-1 w-full lg:w-auto relative group">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-amber-500/50 transition-all duration-300 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                                <Database className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">STORE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Firestore Cluster</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            NoSQL document store partitioned by tenant ID for multi-region scalability.
                        </p>
                    </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex flex-col items-center justify-center px-4 opacity-50">
                    <ArrowRight className="w-6 h-6 text-slate-500 rotate-90 lg:rotate-0" />
                    <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">Trigger</span>
                </div>

                {/* 4. Compute Layer */}
                <div className="flex-1 w-full lg:w-auto relative group">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-purple-500/50 transition-all duration-300 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">COMPUTE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Cloud Functions</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Event-driven serverless functions for image processing and notifications.
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Metrics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-800 pt-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">24ms</div>
                        <div className="text-xs text-slate-500 font-mono uppercase">Avg Latency</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                        <Server className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">99.99%</div>
                        <div className="text-xs text-slate-500 font-mono uppercase">System Uptime</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">100%</div>
                        <div className="text-xs text-slate-500 font-mono uppercase">Type Safety</div>
                    </div>
                </div>
            </div>

        </div>
    );
};
