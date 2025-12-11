"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Project } from "@/lib/data";
import { subscribeToProjects } from "@/lib/subscriptions";
import { LayoutDashboard, PenTool, Settings, Plus, LogOut, FileText, Code2, Globe } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";

export default function AdminDashboard() {
    const { signOut, user } = useAuth();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Use real-time subscription here too for consistency
        const unsub = subscribeToProjects((data) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const StatCard = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => (
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Active Projects" value={projects.length} icon={Code2} />
                    <StatCard label="Writing Posts" value="2" icon={FileText} /> {/* Placeholder for now */}
                    <StatCard label="System Status" value="Online" icon={Globe} />
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
                    <a href="/admin/projects/new" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl transition-all font-bold shadow-lg shadow-emerald-900/20 ml-auto">
                        <Plus className="w-4 h-4" />
                        New Project
                    </a>
                </div>

                {/* Projects Grid */}
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
                            projects.map(p => (
                                <div key={p.slug} className="group p-5 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-between transition-all hover:border-emerald-500/30">
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail tiny */}
                                        <div className="w-12 h-12 rounded-lg bg-black/50 overflow-hidden relative border border-white/5">
                                            {p.coverImage ? (
                                                <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <Code2 className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                                            <p className="text-xs text-slate-500 font-mono">{p.slug}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:flex gap-2">
                                            {p.techStack?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-black/50 text-slate-400 border border-white/10">{t}</span>
                                            ))}
                                            {p.techStack && p.techStack.length > 3 && <span className="text-[10px] px-2 py-1 text-slate-500">+{p.techStack.length - 3}</span>}
                                        </div>
                                        <a href={`/admin/projects/edit?slug=${p.slug}`} className="px-4 py-2 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg text-sm font-medium transition-all">
                                            Edit
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
