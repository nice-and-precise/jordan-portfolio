import { useForm, useFieldArray } from "react-hook-form";
import { Project } from "@/lib/data";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import ImageUploader from "./ImageUploader";
import MagicWand from "./MagicWand";
import { Plus, X } from "lucide-react";
import NanoBanana from "./NanoBanana";

type ProjectFormData = Project;

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export default function ProjectForm({ initialData, onSubmit, isSubmitting = false }: ProjectFormProps) {
    const { register, control, handleSubmit, reset, setValue, watch } = useForm<ProjectFormData>({
        defaultValues: {
            techStack: [],
            impact: [],
            role: [],
            title: "", // Ensure controlled inputs have defaults
            subtitle: "",
            slug: "",
            coverImage: "",
            overview: "",
            challenge: "",
            technicalDeepDive: "",
            ...initialData
        }
    });

    const { fields: impactFields, append: appendImpact, remove: removeImpact } = useFieldArray({
        control,
        name: "impact"
    });

    // Simple array management for Tech Stack (string array)
    const techStack = watch("techStack");
    const role = watch("role");
    const [showNanoBanana, setShowNanoBanana] = useState(false);

    // Update form if initialData changes (e.g. after fetch)
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleAddString = (field: "techStack" | "role", value: string) => {
        if (!value) return;
        const current = watch(field) || [];
        setValue(field, [...current, value]);
    };

    const handleRemoveString = (field: "techStack" | "role", index: number) => {
        const current = watch(field) || [];
        setValue(field, current.filter((_, i) => i !== index));
    };

    // Helper for adding simple tags
    const AddTagInput = ({ field }: { field: "techStack" | "role" }) => {
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAddString(field, e.currentTarget.value);
                e.currentTarget.value = "";
            }
        };
        return (
            <input
                type="text"
                placeholder={`Add ${field === 'techStack' ? 'Tech' : 'Role'} (Enter)`}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white text-sm"
            />
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Main Info */}
            <div className="grid gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white text-xl">Core Details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Title</label>
                        <input {...register("title", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Subtitle</label>
                        <input {...register("subtitle", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Slug (ID)</label>
                    <input
                        {...register("slug", { required: true })}
                        className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white disabled:opacity-50 font-mono text-sm"
                        disabled={!!initialData}
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Cover Image</label>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <input
                                {...register("coverImage", { required: true })}
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-mono text-xs"
                                placeholder="https://..."
                            />
                        </div>
                        <ImageUploader value={watch("coverImage")} onChange={(url) => setValue("coverImage", url)} />
                    </div>
                    {/* Nano Banana Button */}
                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            onClick={() => setShowNanoBanana(true)}
                            className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 border border-yellow-400/30 rounded px-2 py-1 hover:bg-yellow-400/10 transition-colors"
                        >
                            <span>🍌 Edit with Nano Banana</span>
                        </button>
                    </div>

                    {watch("coverImage") && (
                        <div className="mt-4 relative h-40 w-full md:w-64 rounded-lg overflow-hidden border border-slate-700">
                            <NextImage src={watch("coverImage")} alt="Cover" fill className="object-cover" unoptimized />
                        </div>
                    )}
                </div>
            </div>

            {/* Arrays: Tech Stack & Role */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h2 className="font-bold text-white mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {techStack?.map((tech, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-sm flex items-center gap-2">
                                {tech}
                                <button type="button" onClick={() => handleRemoveString("techStack", i)}><X className="w-3 h-3 hover:text-white" /></button>
                            </span>
                        ))}
                    </div>
                    <AddTagInput field="techStack" />
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h2 className="font-bold text-white mb-4">Roles</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {role?.map((r, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                                {r}
                                <button type="button" onClick={() => handleRemoveString("role", i)}><X className="w-3 h-3 hover:text-white" /></button>
                            </span>
                        ))}
                    </div>
                    <AddTagInput field="role" />
                </div>
            </div>

            {/* Impact Metrics */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-white text-xl">Impact Metrics</h2>
                </div>

                <div className="space-y-3">
                    {impactFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <input
                                {...register(`impact.${index}.value`)}
                                placeholder="Value (e.g. 40%)"
                                className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                            />
                            <input
                                {...register(`impact.${index}.label`)}
                                placeholder="Label (e.g. Efficiency)"
                                className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                            />
                            <div className="flex gap-2">
                                <input
                                    {...register(`impact.${index}.description`)}
                                    placeholder="Short description"
                                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white flex-1"
                                />
                                <MagicWand
                                    currentValue={watch(`impact.${index}.description`) || ""}
                                    onAccept={(val) => setValue(`impact.${index}.description`, val)}
                                    context="Impact metric description"
                                    className="relative"
                                />
                                <button type="button" onClick={() => removeImpact(index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                                    <div className="w-4 h-4">×</div>
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendImpact({ label: "", value: "", description: "" })}
                        className="flex items-center justify-center gap-2 py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Metric
                    </button>
                </div>
            </div>

            {/* Copywriting */}
            <div className="grid gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white text-xl">Copywriting (Powered by Gemini)</h2>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-slate-400">Overview</label>
                        <MagicWand
                            currentValue={watch("overview")}
                            onAccept={(val) => setValue("overview", val)}
                            context="Project overview for technical portfolio. Professional, punchy, high-impact."
                        />
                    </div>
                    <textarea {...register("overview", { required: true })} rows={4} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white leading-relaxed" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-slate-400">Challenge</label>
                        <MagicWand
                            currentValue={watch("challenge")}
                            onAccept={(val) => setValue("challenge", val)}
                            context="The business challenge and technical constraints."
                        />
                    </div>
                    <textarea {...register("challenge", { required: true })} rows={4} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white leading-relaxed" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-slate-400">Technical Deep Dive</label>
                        <MagicWand
                            currentValue={watch("technicalDeepDive")}
                            onAccept={(val) => setValue("technicalDeepDive", val)}
                            context="Deep technical explanation of the solution, architecture, and engineering patterns."
                        />
                    </div>
                    <textarea {...register("technicalDeepDive", { required: true })} rows={8} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-mono text-sm leading-relaxed" />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="fixed bottom-6 right-6 z-50 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting ? (
                    <>Saving...</>
                ) : (
                    <>
                        <span className="text-lg">Save Project</span>
                        <Check className="w-5 h-5" />
                    </>
                )}
            </button>
            <div className="h-20" /> {/* Spacer for fixed button */}

            <NanoBanana
                isOpen={showNanoBanana}
                onClose={() => setShowNanoBanana(false)}
                imageUrl={watch("coverImage")}
            />
        </form>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}
