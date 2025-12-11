"use client";

import { useForm } from "react-hook-form";
import { Project } from "@/lib/data";
import { useEffect } from "react";
import UploadButton from "./UploadButton";

// Omit slug from the form data if it's an edit, but we might want to show it as read-only
// For simplicity, let's keep it but maybe disable it on edit if needed.
type ProjectFormData = Project;

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export default function ProjectForm({ initialData, onSubmit, isSubmitting = false }: ProjectFormProps) {
    const { register, handleSubmit, reset, setValue } = useForm<ProjectFormData>({
        defaultValues: {
            techStack: [],
            impact: [],
            role: [],
            ...initialData
        }
    });

    // Update form if initialData changes (e.g. after fetch)
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Main Info */}
            <div className="grid gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white mb-4">Core Details</h2>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input {...register("title", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Subtitle</label>
                    <input {...register("subtitle", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Slug (ID)</label>
                    <input
                        {...register("slug", { required: true })}
                        className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white disabled:opacity-50"
                        disabled={!!initialData} // Disable slug editing if updating
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Cover Image URL</label>
                    <div className="flex gap-2">
                        <input {...register("coverImage", { required: true })} className="flex-1 bg-slate-950 border border-slate-700 p-2 rounded text-white" placeholder="https://..." />
                        <UploadButton onUploadComplete={(url) => {
                            setValue("coverImage", url);
                        }} />
                    </div>
                </div>
            </div>

            {/* Copywriting */}
            <div className="grid gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white mb-4">Copywriting</h2>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Overview</label>
                    <textarea {...register("overview", { required: true })} rows={4} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Challenge</label>
                    <textarea {...register("challenge", { required: true })} rows={4} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Technical Deep Dive</label>
                    <textarea {...register("technicalDeepDive", { required: true })} rows={6} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : (initialData ? "Update Project" : "Create Project")}
            </button>

        </form>
    );
}
