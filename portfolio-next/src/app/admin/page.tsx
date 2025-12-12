"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Project } from "@/lib/data";
import { subscribeToProjects } from "@/lib/subscriptions";
import { LayoutDashboard, PenTool, Settings, Plus, LogOut, FileText, Code2, Globe, DollarSign, Users } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NextImage from "next/image";

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

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const totalPipeline = leads.reduce((acc, curr) => acc + (curr.annualWaste || 0), 0);

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative overflow-hidden">
            <ParticleEffect density={5} className="opacity-40 fixed inset-0" />

            {/* Top Navigation */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50 relative">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                        <h1 className="text-lg font-bold text-white tracking-tight">Mission Control</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-xs text-right">
                            <p className="text-slate-400">Logged in as</p>
                            <p className="text-white font-medium">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 relative z-10">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Active Projects" value={projects.length} icon={Code2} />
                    <StatCard label="Total Leads" value={leads.length} icon={Users} colorClass="text-blue-400 bg-blue-500/10" />
                    <StatCard label="Pipeline Value" value={formatCurrency(totalPipeline)} icon={DollarSign} colorClass="text-indigo-400 bg-indigo-500/10" />
                    <a href="/admin/leads" className="block transition-transform hover:scale-105">
                        <StatCard label="Inefficiency Reports" value="View All →" icon={FileText} colorClass="text-slate-400 bg-white/5" />
                    </a>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap gap-4">
                    <a href="/admin/settings" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-medium backdrop-blur-sm">
                        <Settings className="w-4 h-4" />
                        Global Settings
                    </a>
                    <a href="/admin/writing" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-medium backdrop-blur-sm">
                        <PenTool className="w-4 h-4" />
                        Manage Writing
                    </a>
                    <a href="/admin/services" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-medium backdrop-blur-sm">
                        <LayoutDashboard className="w-4 h-4" />
                        Services
                    </a>
                    <a href="/admin/projects/new" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl transition-all font-bold shadow-lg shadow-emerald-900/20 ml-auto">
                        <Plus className="w-4 h-4" />
                        New Project
                    </a>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Projects */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Recent Projects</h2>
                        <div className="grid gap-4">
                            {loading ? (
                                <div className="text-slate-500 italic">Syncing satellite data...</div>
                            ) : projects.length === 0 ? (
                                <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-slate-500">
                                    No projects verified. Start a new mission.
                                </div>
                            ) : (
                                projects.slice(0, 5).map(p => (
                                    <div key={p.slug} className="group p-4 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-between transition-all hover:border-emerald-500/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-black/50 overflow-hidden relative border border-white/5">
                                                {p.coverImage ? (
                                                    <NextImage src={p.coverImage} alt="" fill className="object-cover" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <Code2 className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                                                <p className="text-[10px] text-slate-500 font-mono hidden md:block">{p.slug}</p>
                                            </div>
                                        </div>
                                        <a href={`/admin/projects/edit?slug=${p.slug}`} className="px-3 py-1.5 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg text-xs font-medium transition-all">
                                            Edit
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Leads */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Recent Leads</h2>
                        <div className="grid gap-4">
                            {leads.length === 0 ? (
                                <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-slate-500">
                                    No inefficiency reports yet.
                                </div>
                            ) : leads.slice(0, 5).map(lead => (
                                <div key={lead.id} className="p-4 border border-white/10 bg-white/5 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-sm">{lead.email}</h3>
                                                {lead.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{lead.employees} employees · {lead.inefficiency}% inefficiency</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 font-bold font-mono text-sm">{formatCurrency(lead.annualWaste)}</p>
                                            <p className="text-[10px] text-slate-600">/year waste</p>
                                        </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ label, value, icon: Icon, colorClass = "text-emerald-400 bg-emerald-500/10" }: { label: string, value: string | number, icon: any, colorClass?: string }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm">
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);
