"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteSettings, getSiteSettings, updateSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { Loader2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import MagicWand from "@/components/admin/MagicWand";
import ImageUploader from "@/components/admin/ImageUploader";

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

    const { register, handleSubmit, reset, watch, setValue } = useForm<SiteSettings>();

    useEffect(() => {
        getSiteSettings().then((settings) => {
            // Intelligent Fallback: If DB has empty strings for new fields, use Defaults
            const mergedSettings = { ...settings };

            // Helper to ensure default is used if value is falsy or undefined
            type SettingKey = keyof SiteSettings;
            const ensureDefault = (key: SettingKey) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((mergedSettings as any)[key] === undefined || (mergedSettings as any)[key] === null) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (mergedSettings as any)[key] = (DEFAULT_SETTINGS as any)[key];
                }
            };

            // Apply defaults for visibility toggles
            ensureDefault('showTeaser');
            ensureDefault('showMethodology');
            ensureDefault('showCalculator');
            ensureDefault('showProjects');
            ensureDefault('showContact');

            ensureDefault('teaserBackgroundUrl');

            // Apply defaults for potentially missing/empty content sections
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

    // Helper for Visibility Toggle
    const VisibilityToggle = ({ field, label }: { field: keyof SiteSettings, label: string }) => {
        const isVisible = watch(field) as boolean;
        return (
            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                <span className="font-bold text-slate-300">{label}</span>
                <button
                    type="button"
                    onClick={() => setValue(field, !isVisible)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}
                >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-sm font-bold">{isVisible ? 'Visible' : 'Hidden'}</span>
                </button>
            </div>
        );
    };

    // Experience Manager Subcomponent
    const ExperienceManager = ({ items, onChange }: { items: SiteSettings['experience'], onChange: (items: SiteSettings['experience']) => void }) => {
        const addItem = () => {
            const newItem = { id: Date.now().toString(), year: new Date().getFullYear().toString(), title: "New Role", company: "Company", description: " Description..." };
            onChange([...items, newItem]);
        };

        const updateItem = (index: number, field: keyof SiteSettings['experience'][0], value: string) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            onChange(newItems);
        };

        const removeItem = (index: number) => {
            const newItems = items.filter((_, i) => i !== index);
            onChange(newItems);
        };

        return (
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Experience Timeline</h2>
                    <button type="button" onClick={addItem} className="text-xs bg-emerald-600 px-3 py-1 rounded text-white font-bold hover:bg-emerald-500">
                        + Add Role
                    </button>
                </div>
                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 relative group">
                            <button type="button" onClick={() => removeItem(index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold p-1">Delete</button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Year</label>
                                    <input value={item.year} onChange={(e) => updateItem(index, 'year', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Company</label>
                                    <input value={item.company} onChange={(e) => updateItem(index, 'company', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">Role Title</label>
                                    <input value={item.title} onChange={(e) => updateItem(index, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">Description</label>
                                    <textarea rows={2} value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-slate-500 italic text-sm text-center">No experience items yet.</p>}
                </div>
            </div>
        );
    };

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
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Hero Title (e.g. GRAVITY)</label>
                                    <MagicWand currentValue={watch("heroTitle") || ""} onAccept={v => setValue("heroTitle", v)} context="Personal brand title, short, punchy" />
                                </div>
                                <input {...register("heroTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold tracking-widest" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Subtitle</label>
                                    <MagicWand currentValue={watch("heroSubtitle") || ""} onAccept={v => setValue("heroSubtitle", v)} context="Professional tagline" />
                                </div>
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
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Switcher Instruction Text</label>
                                    <MagicWand currentValue={watch("heroSwitcherInstruction") || ""} onAccept={v => setValue("heroSwitcherInstruction", v)} context="Instruction to click badge" />
                                </div>
                                <input {...register("heroSwitcherInstruction")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                <p className="text-xs text-slate-500 mt-2">Text displayed below the CTA (e.g. "Click badge to toggle...")</p>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Strategies Content */}
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Teaser Section</h2>
                            <VisibilityToggle field="showTeaser" label="Show Section" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Headline</label>
                                    <MagicWand currentValue={watch("teaserTitle") || ""} onAccept={v => setValue("teaserTitle", v)} context="Headline for bio teaser" />
                                </div>
                                <input {...register("teaserTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Body Text</label>
                                    <MagicWand currentValue={watch("teaserBody") || ""} onAccept={v => setValue("teaserBody", v)} context="Short bio teaser text" />
                                </div>
                                <textarea {...register("teaserBody")} rows={3} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">CTA Button Text</label>
                                <input {...register("teaserCtaText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Capabilities */}
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Methodology</h2>
                            <VisibilityToggle field="showMethodology" label="Show Section" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Section Title</label>
                                    <MagicWand currentValue={watch("methodologyTitle") || ""} onAccept={v => setValue("methodologyTitle", v)} context="Section title" />
                                </div>
                                <input {...register("methodologyTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Headline</label>
                                    <MagicWand currentValue={watch("methodologySubtitle") || ""} onAccept={v => setValue("methodologySubtitle", v)} context="Methodology headline" />
                                </div>
                                <input {...register("methodologySubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Body Copy</label>
                                    <MagicWand currentValue={watch("methodologyBody") || ""} onAccept={v => setValue("methodologyBody", v)} context="Methodology description" />
                                </div>
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Calculator</h2>
                            <VisibilityToggle field="showCalculator" label="Show Section" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Title</label>
                                    <MagicWand currentValue={watch("calculatorTitle") || ""} onAccept={v => setValue("calculatorTitle", v)} context="Calculator Title" />
                                </div>
                                <input {...register("calculatorTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Subtitle</label>
                                    <MagicWand currentValue={watch("calculatorSubtitle") || ""} onAccept={v => setValue("calculatorSubtitle", v)} context="Calculator Subtitle" />
                                </div>
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
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Top Label</label>
                                    <MagicWand currentValue={watch("aboutTitle") || ""} onAccept={v => setValue("aboutTitle", v)} context="About page title" />
                                </div>
                                <input {...register("aboutTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Main Headline</label>
                                    <MagicWand currentValue={watch("aboutSubtitle") || ""} onAccept={v => setValue("aboutSubtitle", v)} context="About page headline" />
                                </div>
                                <textarea {...register("aboutSubtitle")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm text-slate-400">Bio Paragraphs</label>
                                <div className="relative">
                                    <textarea {...register("aboutBody1")} rows={3} placeholder="Paragraph 1" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                    <MagicWand currentValue={watch("aboutBody1") || ""} onAccept={v => setValue("aboutBody1", v)} context="Professional bio paragraph 1" className="absolute top-2 right-2" />
                                </div>
                                <div className="relative">
                                    <textarea {...register("aboutBody2")} rows={3} placeholder="Paragraph 2" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                    <MagicWand currentValue={watch("aboutBody2") || ""} onAccept={v => setValue("aboutBody2", v)} context="Professional bio paragraph 2" className="absolute top-2 right-2" />
                                </div>
                                <div className="relative">
                                    <textarea {...register("aboutBody3")} rows={3} placeholder="Paragraph 3" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                    <MagicWand currentValue={watch("aboutBody3") || ""} onAccept={v => setValue("aboutBody3", v)} context="Professional bio paragraph 3" className="absolute top-2 right-2" />
                                </div>
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Projects Section</h2>
                            <VisibilityToggle field="showProjects" label="Show Section" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Eyebrow (Small)</label>
                                    <MagicWand currentValue={watch("projectsEyebrow") || ""} onAccept={v => setValue("projectsEyebrow", v)} context="Short eyebrow text" />
                                </div>
                                <input {...register("projectsEyebrow")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Title</label>
                                    <MagicWand currentValue={watch("projectsTitle") || ""} onAccept={v => setValue("projectsTitle", v)} context="Projects section title" />
                                </div>
                                <input {...register("projectsTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Subtitle</label>
                                    <MagicWand currentValue={watch("projectsSubtitle") || ""} onAccept={v => setValue("projectsSubtitle", v)} context="Projects section subtitle description" />
                                </div>
                                <textarea {...register("projectsSubtitle")} rows={2} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Button Text</label>
                                <input {...register("projectsButtonText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                        </div>
                    </div>

                    {/* EXPERIENCE TIMELINE MANAGEMENT */}
                    <ExperienceManager
                        items={watch("experience") || []}
                        onChange={(newItems) => setValue("experience", newItems)}
                    />

                    {/* Footer / Contact */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Footer & Contact</h2>
                            <VisibilityToggle field="showContact" label="Show Section" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Title</label>
                                    <MagicWand currentValue={watch("contactTitle") || ""} onAccept={v => setValue("contactTitle", v)} context="Contact section title" />
                                </div>
                                <input {...register("contactTitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Subtitle</label>
                                    <MagicWand currentValue={watch("contactSubtitle") || ""} onAccept={v => setValue("contactSubtitle", v)} context="Contact section subtitle" />
                                </div>
                                <input {...register("contactSubtitle")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Button Text</label>
                                <input {...register("contactButtonText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Button Text</label>
                                <input {...register("contactButtonText")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>

                            <div className="py-4 border-t border-slate-800">
                                <VisibilityToggle field="showChatWidget" label="AI Agent Widget" />
                            </div>

                            <hr className="border-slate-800 my-6" />

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm text-slate-400">Intro / Bio Text</label>
                                    <MagicWand currentValue={watch("introText") || ""} onAccept={v => setValue("introText", v)} context="Short footer bio" />
                                </div>
                                <textarea {...register("introText")} rows={3} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                                    <input {...register("contactEmail")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Resume URL</label>
                                    <input {...register("resumeUrl")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">LinkedIn URL</label>
                                    <input {...register("linkedinUrl")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Github URL</label>
                                    <input {...register("githubUrl")} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <label className="block text-sm text-slate-400 mb-2">Gemini API Key (AI Tools)</label>
                                <input
                                    type="password"
                                    {...register("googleApiKey")}
                                    placeholder="AI Key..."
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
                                />
                                <p className="text-xs text-slate-500 mt-2">Required for AI Generation features.</p>
                            </div>
                        </div>

                    </div>

                    {/* Floating Save Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-all ${saving ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105'}`}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {saving ? "Saving..." : "Save Global Settings"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
