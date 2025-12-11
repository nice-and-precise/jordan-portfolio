"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteSettings, getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { Loader2 } from "lucide-react";

export default function GlobalSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, reset } = useForm<SiteSettings>();

    useEffect(() => {
        getSiteSettings().then((settings) => {
            reset(settings);
            setLoading(false);
        });
    }, [reset]);

    const onSubmit = async (data: SiteSettings) => {
        setSaving(true);
        try {
            await updateSiteSettings(data);
            alert("Settings saved!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-white">Loading Settings...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Global Settings</h1>
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">doc: settings/global</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Hero Section */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            Home Page / Hero
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Hero Title (e.g. GRAVITY)</label>
                                <input {...register("heroTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold tracking-widest" />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Subtitle (e.g. Engineering x Design)</label>
                                <input {...register("heroSubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Contact */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Footer & Contact</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Intro / Bio Text</label>
                                <textarea {...register("introText")} rows={3} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Contact Email</label>
                                <input
                                    {...register("contactEmail")}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Resume / CV URL</label>
                                <input
                                    {...register("resumeUrl")}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                <p className="text-xs text-slate-500 mt-1">Link to your PDF resume. Appears in the floating nav.</p>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <h3 className="text-lg font-bold text-white mb-4">AI Configuration</h3>
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-4">
                                    <p className="text-indigo-300 text-sm">
                                        Enter your Google Gemini API Key to enable Magic Text and Image features.
                                        <br />
                                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-white">Get a key here</a>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Gemini API Key</label>
                                    <input
                                        {...register("googleApiKey")}
                                        type="password"
                                        placeholder="AIzaSy..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="fixed bottom-6 right-6 z-50 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : "Save Settings"}
                    </button>
                    <div className="h-20" />

                </form>
            </div>
        </div>
    );
}
