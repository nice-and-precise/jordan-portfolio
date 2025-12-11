"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function AdminDashboard() {
    const { signOut, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <nav className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">CMS Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{user?.email}</span>
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-red-400 hover:text-red-300"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Projects</h2>
                    <div className="flex gap-4">
                        <a href="/admin/writing" className="px-6 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                            Manage Writing →
                        </a>
                        <a href="/admin/projects/new" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors">
                            + New Project
                        </a>
                    </div>
                </div>

                <div className="grid gap-6">
                    <ProjectList />
                </div>
            </main>
        </div>
    );
}

import { Project } from "@/lib/data";

function ProjectList() {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Dynamic import or simple fetch
        // We can just query Firestore directly here for simplicity
        import("@/lib/data").then(async (mod) => {
            const data = await mod.getAllProjects();
            setProjects(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading projects...</div>;

    return (
        <div className="grid gap-4">
            {projects.map(p => (
                <div key={p.slug} className="p-6 border border-slate-800 rounded-xl bg-slate-900/50 flex justify-between items-center group">
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                        <p className="text-slate-500 text-sm">{p.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600 text-xs font-mono">{p.slug}</span>
                        <a href={`/admin/projects/edit?slug=${p.slug}`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-white transition-colors">
                            Edit
                        </a>
                    </div>
                </div>
            ))}
            {projects.length === 0 && <p className="text-slate-500">No projects found.</p>}
        </div>
    );
}
