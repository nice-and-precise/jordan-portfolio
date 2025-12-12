"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database,
    Smartphone,
    Wifi,
    Server,
    Globe,
    Layers,
    ArrowRight,
    Zap,
    Cpu
} from "lucide-react";

export const ArchitectureDiagram = () => {
    return (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-8 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <h3 className="text-xl font-bold text-white mb-12 relative z-10">System Architecture: Data Ingestion v2.0</h3>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between max-w-5xl mx-auto">

                {/* 1. Source */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-64 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400 font-bold">
                            <Smartphone className="w-5 h-5" /> Field App (PWA)
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Offline-first reactive client using IndexedDB for local persistence.
                        </p>
                    </div>
                    <div className="h-8 w-px bg-slate-700 md:hidden"></div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center text-slate-600">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>

                {/* 2. Middle Middleware */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-64 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold">
                            <Wifi className="w-5 h-5" /> Sync Engine
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Background protocol handling conflict resolution and delta updates.
                        </p>
                    </div>
                    <div className="h-8 w-px bg-slate-700 md:hidden"></div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center text-slate-600">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>

                {/* 3. Backend Services */}
                <div className="flex flex-col gap-4">
                    {/* Firestore */}
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-64 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-orange-400 font-bold">
                            <Database className="w-5 h-5" /> Firestore
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            NoSQL document store for real-time data propagation.
                        </p>
                    </div>

                    {/* Cloud Functions */}
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-64 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-purple-400 font-bold">
                            <Cpu className="w-5 h-5" /> Cloud Functions
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Serverless triggers for post-processing and notifications.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
