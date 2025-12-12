"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";
import { Service } from "@/lib/data";

// Icons supported in BentoServices
const ICON_OPTIONS = [
    'Bot', 'TrendingUp', 'Workflow', 'Database', 'Zap', 'ShieldCheck',
    'Activity', 'Code2', 'Cpu', 'Globe', 'Server', 'Smartphone'
];

export default function EditServicePage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(!!id);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset } = useForm<Service>({
        defaultValues: {
            title: "",
            description: "",
            icon: "Zap",
            impact: "",
            colSpan: 1
        }
    });

    useEffect(() => {
        if (id) {
            const fetchService = async () => {
                const docRef = doc(db, "services", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    reset({ id: snap.id, ...snap.data() } as Service);
                }
                setLoading(false);
            };
            fetchService();
        }
    }, [id, reset]);

    const onSubmit = async (data: Service) => {
        setSubmitting(true);
        try {
            const serviceId = id || data.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
            await setDoc(doc(db, "services", serviceId), {
                ...data,
                order: Date.now() // Simple ordering, or could use a field
            });
            alert("Service saved!");
            router.push("/admin/services");
        } catch (error) {
            console.error(error);
            alert("Error saving service.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative overflow-hidden">
            <ParticleEffect density={5} className="opacity-40 fixed inset-0" />

            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
                    <a href="/admin/services" className="hover:text-emerald-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </a>
                    <h1 className="text-lg font-bold text-white">
                        {id ? "Edit Service" : "New Service"}
                    </h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 md:p-8 relative z-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-slate-400 mb-2">Title</label>
                            <input {...register("title", { required: true })} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" placeholder="e.g. Workflow Automation" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-slate-400 mb-2">Description</label>
                            <textarea {...register("description", { required: true })} rows={3} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" placeholder="Short value prop..." />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Icon</label>
                            <select {...register("icon")} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white">
                                {ICON_OPTIONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Impact Stat (e.g. &quot;+15% ROI&quot;)</label>
                            <input {...register("impact")} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Column Span (Layout)</label>
                            <select {...register("colSpan", { valueAsNumber: true })} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white">
                                <option value={1}>1 Column (Standard)</option>
                                <option value={2}>2 Columns (Wide)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Capability
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
