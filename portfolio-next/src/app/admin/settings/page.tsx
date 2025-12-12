"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteSettings, getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { Loader2 } from "lucide-react";

export default function GlobalSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [keySkillsInput, setKeySkillsInput] = useState("");

    const { register, handleSubmit, reset } = useForm<SiteSettings>();

    useEffect(() => {
        getSiteSettings().then((settings) => {
            reset(settings);
            setKeySkillsInput(settings.keySkills?.join(", ") || "");
            setLoading(false);
        });
    }, [reset]);

    const onSubmit = async (data: SiteSettings) => {
        setSaving(true);
        try {
            // Manually handle keySkills array
            const updatedSettings = {
                ...data,
                keySkills: keySkillsInput.split(",").map(s => s.trim()).filter(s => s)
            };

            await updateSiteSettings(updatedSettings);
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

                            <div>
                                <label className="block text-sm text-emerald-400 mb-2 font-bold">Active Narrative Strategy</label>
                                <select {...register("heroPersona")} className="w-full bg-slate-950 border border-emerald-500/30 p-3 rounded-lg text-white">
                                    <option value="aggressive">Aggressive (Velocity & Scale)</option>
                                    <option value="empathetic">Empathetic (Chaos to Order)</option>
                                    <option value="visionary">Visionary (Future Architecture)</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">Changes the StoryBrand script on the homepage.</p>
                            </div>
                        </div>
                    </div>

                    {/* Teaser Section */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Teaser Section (Who is Jordan?)</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Headline</label>
                                <input {...register("teaserTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Body Text</label>
                                <textarea {...register("teaserBody")} rows={3} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">CTA Button Text</label>
                                <input {...register("teaserCtaText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Capabilities (Bento) */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Capabilities / Services</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Section Title (Small)</label>
                                <input {...register("capabilitiesTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Section Subtitle (Big)</label>
                                <input {...register("capabilitiesSubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Methodology Section */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Methodology</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Section Title</label>
                                <input {...register("methodologyTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Headline</label>
                                <input {...register("methodologySubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Body Copy</label>
                                <textarea {...register("methodologyBody")} rows={4} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Calculator Section */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Calculator</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Title</label>
                                <input {...register("calculatorTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Subtitle</label>
                                <input {...register("calculatorSubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* About Page */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">About Page</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Top Label</label>
                                <input {...register("aboutTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Main Headline</label>
                                <textarea {...register("aboutSubtitle")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm text-slate-400">Bio Paragraphs</label>
                                <textarea {...register("aboutBody1")} rows={3} placeholder="Paragraph 1" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                <textarea {...register("aboutBody2")} rows={3} placeholder="Paragraph 2" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                <textarea {...register("aboutBody3")} rows={3} placeholder="Paragraph 3" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Core Competencies / Key Skills (Comma Separated)</label>
                                <input
                                    value={keySkillsInput}
                                    onChange={(e) => setKeySkillsInput(e.target.value)}
                                    placeholder="e.g. Process Automation, Leadership, React"
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                />
                                <p className="text-xs text-slate-500 mt-1">These appear in the grid at the bottom of the About section.</p>
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
