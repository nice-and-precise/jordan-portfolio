"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Project } from "@/lib/data";
import { subscribeToProjects } from "@/lib/subscriptions";
import {
    LayoutDashboard,
    PenTool,
    Settings,
    Plus,
    LogOut,
    FileText,
    Code2,
    Activity,
    DollarSign,
    Database,
    Shield
} from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NextImage from "next/image";
import DashboardCharts from "@/components/admin/DashboardCharts";
import Link from "next/link";

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
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Top Navigation Bar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Shield className="w-4 h-4" />
                        </div>
                        <h1 className="text-lg font-bold text-white tracking-tight">
                            Admin<span className="text-slate-500">Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
                            <p className="text-xs text-slate-300 font-medium">{user?.email}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-800 mx-2" />
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg"
                            title="Sign Out"
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
                        label="Active Projects"
                        value={projects.length}
                        icon={Database}
                        color="blue"
                    />
                    <StatCard
                        label="New Leads"
                        value={leads.length}
                        icon={Activity}
                        color="emerald"
                    />
                    <StatCard
                        label="Pipeline Value"
                        value={formatCurrency(totalPipeline)}
                        icon={DollarSign}
                        color="amber"
                    />
                    <Link href="/admin/leads" className="block group h-full">
                        <div className="h-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 flex flex-col justify-center items-center gap-2 cursor-pointer transition-all hover:bg-slate-800 rounded-xl">
                            <span className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-400">
                                <FileText className="w-6 h-6" />
                            </span>
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white mt-2">View Reports &rarr;</span>
                        </div>
                    </Link>
                </div>

                {/* Quick Actions Console */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <QuickAction href="/admin/settings" icon={Settings} label="Global Settings" />
                        <QuickAction href="/admin/writing" icon={PenTool} label="Writing" />
                        <QuickAction href="/admin/services" icon={LayoutDashboard} label="Services" />

                        <div className="flex-1" />

                        <Link href="/admin/projects/new" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                            <Plus className="w-4 h-4" />
                            New Project
                        </Link>
                    </div>
                </div>

                {/* Analytics */}
                <div className="border-t border-slate-800 pt-8">
                    <DashboardCharts projects={projects} leads={leads} />
                </div>

                {/* Content Ledger */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Project Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-blue-500" />
                                Recent Projects
                            </h2>
                            <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded">Live Updates</span>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-slate-500 italic p-12 text-center bg-slate-900/50 rounded-xl">Loading Projects...</div>
                            ) : projects.length === 0 ? (
                                <div className="p-12 bg-slate-900/50 rounded-xl text-center text-slate-500">
                                    No projects found. Start by creating one.
                                </div>
                            ) : (
                                projects.slice(0, 5).map(p => (
                                    <div key={p.slug} className="group p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition-all hover:shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-800 relative rounded-lg overflow-hidden">
                                                {p.coverImage ? (
                                                    <NextImage src={p.coverImage} alt="" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <Code2 className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">
                                                    {p.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5 font-mono">{p.slug}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex gap-1">
                                                {p.techStack.slice(0, 2).map(t => (
                                                    <span key={t} className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-800 rounded-full">{t}</span>
                                                ))}
                                            </div>
                                            <Link href={`/admin/projects/edit?slug=${p.slug}`} className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Incoming Signals (Leads) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Recent Leads
                            </h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {leads.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">
                                    No leads yet.
                                </div>
                            ) : leads.slice(0, 8).map(lead => (
                                <div key={lead.id} className="p-3 mb-1 hover:bg-slate-800/50 rounded-lg transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                            <h3 className="font-bold text-slate-300 text-sm truncate max-w-[140px]" title={lead.email}>{lead.email}</h3>
                                        </div>
                                        <span className="text-emerald-400 font-mono text-xs font-bold">{formatCurrency(lead.annualWaste)}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-500 px-4">
                                        <span>{lead.employees} employees</span>
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

const StatCard = ({ label, value, icon: Icon, color = "blue" }: { label: string, value: string | number, icon: any, color?: "blue" | "emerald" | "amber" }) => {

    const colorClasses = {
        blue: "text-blue-500 bg-blue-500/10",
        emerald: "text-emerald-500 bg-emerald-500/10",
        amber: "text-amber-500 bg-amber-500/10"
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]} transition-colors`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div>
                <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

const QuickAction = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <Link href={href} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm font-bold">
        <Icon className="w-4 h-4 text-slate-500" />
        {label}
    </Link>
);
