"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteSettings, getSiteSettings, updateSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { Loader2 } from "lucide-react";

export default function GlobalSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Manual State for Arrays/Objects
    const [keySkillsInput, setKeySkillsInput] = useState("");
    const [methodologyListInput, setMethodologyListInput] = useState("");
    const [stat1Value, setStat1Value] = useState("");
    const [stat1Label, setStat1Label] = useState("");
    const [stat2Value, setStat2Value] = useState("");
    const [stat2Label, setStat2Label] = useState("");

    const { register, handleSubmit, reset } = useForm<SiteSettings>();

    useEffect(() => {
        getSiteSettings().then((settings) => {
            // Intelligent Fallback: If DB has empty strings for new fields, use Defaults
            const mergedSettings = { ...settings };

            // Helper to ensure default is used if value is falsy
            type SettingKey = keyof SiteSettings;
            const ensureDefault = (key: SettingKey) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!mergedSettings[key] && (DEFAULT_SETTINGS as any)[key]) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (mergedSettings as any)[key] = (DEFAULT_SETTINGS as any)[key];
                }
            };

            // Apply defaults for potentially missing/empty sections
            ensureDefault('teaserTitle');
            ensureDefault('teaserBody');
            ensureDefault('teaserCtaText');

            ensureDefault('capabilitiesTitle');
            ensureDefault('capabilitiesSubtitle');

            ensureDefault('methodologyTitle');
            ensureDefault('methodologySubtitle');
            ensureDefault('methodologyBody');

            ensureDefault('calculatorTitle');
            ensureDefault('calculatorSubtitle');

            ensureDefault('projectsEyebrow');
            ensureDefault('projectsTitle');
            ensureDefault('projectsSubtitle');
            ensureDefault('projectsButtonText');

            ensureDefault('contactTitle');
            ensureDefault('contactSubtitle');
            ensureDefault('contactButtonText');
            ensureDefault('introText');

            // Navigation Labels
            ensureDefault('navHomeLabel');
            ensureDefault('navAboutLabel');
            ensureDefault('navWorkLabel');
            ensureDefault('navContactLabel');
            ensureDefault('navResumeLabel');
            ensureDefault('navCmsLabel');

            // Calculator Labels
            ensureDefault('calcHeadcountLabel');
            ensureDefault('calcRateLabel');
            ensureDefault('calcInefficiencyLabel');
            ensureDefault('calcBurnLabel');
            ensureDefault('calcDisclaimer');
            ensureDefault('calcPlaceholder');
            ensureDefault('calcButtonText');
            ensureDefault('calcSuccessMessage');

            reset(mergedSettings);

            // Handle Manual State Inputs
            setKeySkillsInput(mergedSettings.keySkills?.join(", ") || DEFAULT_SETTINGS.keySkills.join(", "));
            setMethodologyListInput(mergedSettings.methodologyList?.join("\n") || DEFAULT_SETTINGS.methodologyList.join("\n"));

            if (mergedSettings.stats && mergedSettings.stats.length > 0) {
                setStat1Value(mergedSettings.stats[0]?.value || "");
                setStat1Label(mergedSettings.stats[0]?.label || "");
                if (mergedSettings.stats.length > 1) {
                    setStat2Value(mergedSettings.stats[1]?.value || "");
                    setStat2Label(mergedSettings.stats[1]?.label || "");
                }
            } else {
                // Fallback to default stats if empty
                setStat1Value(DEFAULT_SETTINGS.stats[0].value);
                setStat1Label(DEFAULT_SETTINGS.stats[0].label);
                setStat2Value(DEFAULT_SETTINGS.stats[1].value);
                setStat2Label(DEFAULT_SETTINGS.stats[1].label);
            }

            setLoading(false);
        });
    }, [reset]);

    const onSubmit = async (data: SiteSettings) => {
        setSaving(true);
        try {
            // Manually handle complex arrays
            const updatedSettings = {
                ...data,
                keySkills: keySkillsInput.split(",").map(s => s.trim()).filter(s => s),
                methodologyList: methodologyListInput.split("\n").map(s => s.trim()).filter(s => s),
                stats: [
                    { value: stat1Value, label: stat1Label },
                    { value: stat2Value, label: stat2Label }
                ]
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

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Switcher Instruction Text</label>
                                <input {...register("heroSwitcherInstruction")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                <p className="text-xs text-slate-500 mt-2">Text displayed below the CTA (e.g. "Click badge to toggle...")</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Variations (Narrative Strategies) */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Narrative Strategies Content</h2>
                        <p className="text-sm text-slate-400 mb-8">
                            Customize the messaging for each narrative persona.
                        </p>

                        <div className="space-y-12">
                            {/* Aggressive */}
                            <div className="space-y-4 border-l-4 border-red-500 pl-6">
                                <h3 className="text-lg font-bold text-red-400">Aggressive Strategy</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Headline</label>
                                        <input {...register("heroVariations.aggressive.headline")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Subheadline</label>
                                        <textarea {...register("heroVariations.aggressive.subheadline")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Badge</label>
                                        <input {...register("heroVariations.aggressive.badge")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">CTA Text</label>
                                        <input {...register("heroVariations.aggressive.cta")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Empathetic */}
                            <div className="space-y-4 border-l-4 border-blue-500 pl-6">
                                <h3 className="text-lg font-bold text-blue-400">Empathetic Strategy</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Headline</label>
                                        <input {...register("heroVariations.empathetic.headline")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Subheadline</label>
                                        <textarea {...register("heroVariations.empathetic.subheadline")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Badge</label>
                                        <input {...register("heroVariations.empathetic.badge")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">CTA Text</label>
                                        <input {...register("heroVariations.empathetic.cta")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Visionary */}
                            <div className="space-y-4 border-l-4 border-purple-500 pl-6">
                                <h3 className="text-lg font-bold text-purple-400">Visionary Strategy</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Headline</label>
                                        <input {...register("heroVariations.visionary.headline")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-slate-500 mb-1">Subheadline</label>
                                        <textarea {...register("heroVariations.visionary.subheadline")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Badge</label>
                                        <input {...register("heroVariations.visionary.badge")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">CTA Text</label>
                                        <input {...register("heroVariations.visionary.cta")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                    </div>
                                </div>
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

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Benefit List (Comma Separated)</label>
                                <textarea
                                    value={methodologyListInput}
                                    onChange={(e) => setMethodologyListInput(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                />
                                <p className="text-xs text-slate-500 mt-1">e.g. Eliminate Manual Data Entry, Reduce Decision Latency...</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 text-sm font-bold text-slate-400 mt-2">Key Statistics</div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Stat 1 Value</label>
                                    <input value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Stat 1 Label</label>
                                    <input value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Stat 2 Value</label>
                                    <input value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Stat 2 Label</label>
                                    <input value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
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

                            <hr className="border-slate-800" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Headcount Label</label>
                                    <input {...register("calcHeadcountLabel")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Rate Label</label>
                                    <input {...register("calcRateLabel")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Inefficiency Label</label>
                                    <input {...register("calcInefficiencyLabel")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Burn Label</label>
                                    <input {...register("calcBurnLabel")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">Disclaimer</label>
                                    <input {...register("calcDisclaimer")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">Placeholder Text</label>
                                    <input {...register("calcPlaceholder")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Button Text</label>
                                    <input {...register("calcButtonText")} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">Success Message</label>
                                    <textarea {...register("calcSuccessMessage")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                                </div>
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



                    {/* Navigation Labels */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Navigation Labels</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Home (Logo Text)</label>
                                <input {...register("navHomeLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">About Link</label>
                                <input {...register("navAboutLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Work Link</label>
                                <input {...register("navWorkLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Contact Link</label>
                                <input {...register("navContactLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Resume Link</label>
                                <input {...register("navResumeLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">CMS Link</label>
                                <input {...register("navCmsLabel")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Projects Section</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Eyebrow (Small)</label>
                                <input {...register("projectsEyebrow")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Title</label>
                                <input {...register("projectsTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Subtitle</label>
                                <textarea {...register("projectsSubtitle")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Button Text</label>
                                <input {...register("projectsButtonText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Contact */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-bold text-white mb-6">Footer & Contact</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Title</label>
                                <input {...register("contactTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Subtitle</label>
                                <input {...register("contactSubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Button Text</label>
                                <input {...register("contactButtonText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>

                            <hr className="border-slate-800 my-6" />

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
            </div >
        </div >
    );
}
