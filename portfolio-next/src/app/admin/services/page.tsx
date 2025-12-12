"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LayoutDashboard, ArrowLeft, Loader2, Plus, PenTool } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";
import { Service } from "@/lib/data";

export default function ServicesDashboard() {
    const { signOut, user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const q = query(collection(db, "services"), orderBy("order", "asc"));
                const snapshot = await getDocs(q);
                // If empty, we might want to show defaults or nothing.
                const fetchedServices = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Service));
                setServices(fetchedServices);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative overflow-hidden">
            <ParticleEffect density={5} className="opacity-40 fixed inset-0" />

            {/* Top Navigation */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50 relative">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <a href="/admin" className="hover:text-emerald-400 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </a>
                        <h1 className="text-lg font-bold text-white tracking-tight ml-4">Services / Capabilities</h1>
                    </div>
                    <a href="/admin/services/new" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg transition-all text-sm">
                        <Plus className="w-4 h-4" />
                        New Service
                    </a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 relative z-10">

                {/* Services Grid */}
                {loading ? (
                    <div className="text-center p-12 text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading capabilities...
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center p-12 border border-dashed border-white/10 rounded-xl">
                        <p className="text-slate-500 mb-4">No custom services defined. The site is using fallback data.</p>
                        <a href="/admin/services/new" className="text-emerald-400 hover:underline">Define your first service</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div key={service.id} className="group bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={`/admin/services/edit?id=${service.id}`} className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg block">
                                        <PenTool className="w-4 h-4" />
                                    </a>
                                </div>
                                <div className="mb-4 text-blue-400">
                                    {/* Icon placeholder since we store string */}
                                    <span className="font-mono text-xs border border-blue-500/30 px-2 py-1 rounded bg-blue-500/10">
                                        {service.icon || "Zap"}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xs text-slate-500 uppercase">Impact</span>
                                    <span className="text-emerald-400 font-bold text-sm">{service.impact || "N/A"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
