"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Project } from "@/lib/data";
import { subscribeToProjects } from "@/lib/subscriptions";
import { LayoutDashboard, PenTool, Settings, Plus, LogOut, FileText, Code2, Users, DollarSign, Activity, Zap, Terminal, Shield, Database } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NextImage from "next/image";
import DashboardCharts from "@/components/admin/DashboardCharts";

export default function AdminDashboard() {
    const { signOut, user } = useAuth();
    const [projects, setProjects] = React.useState<Project[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [leads, setLeads] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Projects Sub
        const unsubProjects = subscribeToProjects((data) => {
            setProjects(data);
        });

        // Leads Sub
        const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
        const unsubLeads = onSnapshot(q, (snapshot) => {
            setLeads(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        return () => {
            unsubProjects();
            unsubLeads();
        };
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const totalPipeline = leads.reduce((acc, curr) => acc + (curr.annualWaste || 0), 0);

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden selection:bg-green-500/30">
            {/* Matrix Rain Effect Placeholder (using ParticleEffect as base for now) */}
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10 z-0 pointer-events-none" />
            <ParticleEffect density={4} className="opacity-30 fixed inset-0 z-0 text-green-500" />

            {/* CRT Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

            {/* Top Navigation Bar */}
            <nav className="border-b border-green-500/30 bg-black/90 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-green-500 animate-pulse" />
                        <h1 className="text-lg font-bold tracking-widest uppercase">
                            MAINFRAME<span className="text-green-500/50">_ACCESS</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">User Identity</p>
                            <p className="text-xs text-green-400">{user?.email}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-green-500/20 mx-2" />
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-green-600 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/50 rounded group relative"
                            title="Terminate Session"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8 relative z-10">

                {/* KPI Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="NODES_ACTIVE"
                        value={projects.length}
                        icon={Database}
                    />
                    <StatCard
                        label="INCOMING_PACKETS"
                        value={leads.length}
                        icon={Activity}
                    />
                    <StatCard
                        label="RESOURCE_VALUE"
                        value={formatCurrency(totalPipeline)}
                        icon={DollarSign}
                    />
                    <a href="/admin/leads" className="block group">
                        <div className="h-full bg-black border border-green-500/30 hover:border-green-400 p-6 flex flex-col justify-center items-center gap-2 cursor-pointer transition-all hover:bg-green-500/5 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]">
                            <span className="p-3 border border-green-500/50 rounded-none group-hover:bg-green-500 group-hover:text-black transition-colors">
                                <FileText className="w-6 h-6" />
                            </span>
                            <span className="text-sm font-bold text-green-400 group-hover:text-green-300">DECRYPT_REPORTS &gt;</span>
                        </div>
                    </a>
                </div>

                {/* Quick Actions Console */}
                <div className="border border-green-500/20 bg-black/40 p-4 rounded-sm">
                    <p className="text-xs text-green-700 mb-2 uppercase tracking-widest">Command_Line_Interface</p>
                    <div className="flex flex-wrap gap-4 items-center">
                        <QuickAction href="/admin/settings" icon={Settings} label="./config_global" />
                        <QuickAction href="/admin/writing" icon={PenTool} label="./edit_intel" />
                        <QuickAction href="/admin/services" icon={LayoutDashboard} label="./grid_matrix" />

                        <div className="flex-1" />

                        <a href="/admin/projects/new" className="flex items-center gap-2 px-6 py-2 bg-green-900/30 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/50 transition-all font-bold shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] text-sm uppercase tracking-wide">
                            <Plus className="w-4 h-4" />
                            INIT_NEW_PROJECT
                        </a>
                    </div>
                </div>

                {/* Data Visualization Layer */}
                <div className="border-t border-green-500/20 pt-8">
                    <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        SYSTEM_DIAGNOSTICS
                    </h2>
                    {/* Note: Update DashboardCharts later to respect green theme props if needed, or rely on global CSS */}
                    <div className="opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        <DashboardCharts projects={projects} leads={leads} />
                    </div>
                </div>

                {/* Content Ledger */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Project Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center border-b border-green-500/30 pb-2">
                            <h2 className="text-lg font-bold text-green-400 flex items-center gap-2 uppercase">
                                <Code2 className="w-5 h-5" />
                                Deployment_Log
                            </h2>
                            <span className="text-xs font-mono text-green-600 animate-pulse">STATUS: ENCRYPTED</span>
                        </div>

                        <div className="grid gap-3">
                            {loading ? (
                                <div className="text-green-700 italic p-12 text-center border border-dashed border-green-900">Establishing Uplink...</div>
                            ) : projects.length === 0 ? (
                                <div className="p-12 border border-dashed border-green-900 text-center text-green-700">
                                    NULL_POINTER_EXCEPTION: No projects found.
                                </div>
                            ) : (
                                projects.slice(0, 5).map(p => (
                                    <div key={p.slug} className="group p-4 border border-green-500/10 bg-black hover:bg-green-500/10 flex items-center justify-between transition-all hover:border-green-500/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-900/10 relative border border-green-500/30 overflow-hidden">
                                                {p.coverImage ? (
                                                    <NextImage src={p.coverImage} alt="" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale mix-blend-screen" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-green-800">
                                                        <Code2 className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-green-400 text-sm group-hover:text-green-300 transition-colors flex items-center gap-2 uppercase tracking-wide">
                                                    {p.title}
                                                </h3>
                                                <p className="text-[10px] text-green-700 mt-0.5">&gt; {p.slug}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex gap-1">
                                                {p.techStack.slice(0, 2).map(t => (
                                                    <span key={t} className="px-1.5 py-0.5 text-[9px] text-green-600 border border-green-500/20">{t}</span>
                                                ))}
                                            </div>
                                            <a href={`/admin/projects/edit?slug=${p.slug}`} className="px-4 py-2 border border-green-500/30 hover:bg-green-500 hover:text-black text-green-500 text-xs font-bold transition-all uppercase">
                                                [EDIT]
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Incoming Signals (Leads) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-green-500/30 pb-2">
                            <h2 className="text-lg font-bold text-green-400 flex items-center gap-2 uppercase">
                                <Shield className="w-5 h-5" />
                                Signals
                            </h2>
                        </div>

                        <div className="border border-green-500/20 bg-black/40 p-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {leads.length === 0 ? (
                                <div className="p-8 text-center text-xs text-green-800 uppercase tracking-widest">
                                    // NO_SIGNAL
                                </div>
                            ) : leads.slice(0, 8).map(lead => (
                                <div key={lead.id} className="p-3 mb-1 hover:bg-green-500/10 transition-colors border-l-2 border-transparent hover:border-green-500 cursor-cell">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 ${lead.status === 'new' ? 'bg-green-400 animate-ping' : 'bg-green-900'}`} />
                                            <h3 className="font-bold text-green-300 text-xs truncate max-w-[120px] font-mono" title={lead.email}>{lead.email}</h3>
                                        </div>
                                        <span className="text-green-500 font-mono text-xs">{formatCurrency(lead.annualWaste)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-green-700 font-mono pl-3.5">
                                        <span>{lead.employees}</span>
                                        <span>{new Date(lead.timestamp?.seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Subcomponents

const StatCard = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => {
    return (
        <div className="bg-black border border-green-500/30 p-6 relative overflow-hidden group hover:border-green-400 transition-colors">
            {/* Scanline */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/50 opacity-0 group-hover:opacity-100 animate-scanline" />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="p-2 border border-green-500/30 text-green-500">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-xs text-green-700 mb-1 tracking-widest uppercase">{label}</p>
                <p className="text-3xl font-bold text-green-400 tracking-tighter mix-blend-screen">{value}</p>
            </div>
        </div>
    );
};

const QuickAction = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <a href={href} className="flex items-center gap-2 px-4 py-2 bg-black border border-green-500/20 hover:border-green-500 hover:text-green-300 text-green-600 transition-all font-mono text-xs uppercase tracking-wide group">
        <span className="opacity-50 group-hover:opacity-100">&gt;</span>
        {label}
    </a>
);
