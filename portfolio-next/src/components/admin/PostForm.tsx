"use client";

import { useForm } from "react-hook-form";
import { Post } from "@/lib/writing"; // Ensure Post type is exported
import { useEffect } from "react";
import UploadButton from "./UploadButton";

interface PostFormProps {
    initialData?: Post;
    onSubmit: (data: Post) => Promise<void>;
    isSubmitting?: boolean;
}

export default function PostForm({ initialData, onSubmit, isSubmitting = false }: PostFormProps) {
    const { register, handleSubmit, reset, setValue } = useForm<Post>({
        defaultValues: {
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Core Info */}
            <div className="grid gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white mb-4">Post Details</h2>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input {...register("title", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Slug</label>
                    <input
                        {...register("slug", { required: true })}
                        className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white disabled:opacity-50"
                        disabled={!!initialData}
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                    <input type="date" {...register("date", { required: true })} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Cover Image URL</label>
                    <div className="flex gap-2">
                        <input {...register("coverImage")} className="flex-1 bg-slate-950 border border-slate-700 p-2 rounded text-white" placeholder="https://..." />
                        <UploadButton onUploadComplete={(url) => {
                            setValue("coverImage", url);
                        }} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="font-bold text-white mb-4">Content</h2>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Excerpt</label>
                    <textarea {...register("excerpt", { required: true })} rows={3} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Markdown Content</label>
                    <textarea {...register("content", { required: true })} rows={15} className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono" />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : (initialData ? "Update Post" : "Create Post")}
            </button>

        </form>
    );
}
