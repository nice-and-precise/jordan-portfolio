"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getProjectBySlug, Project } from "@/lib/data";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ProjectForm from "@/components/admin/ProjectForm";

function EditProjectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams.get("slug");

    const [project, setProject] = useState<Project | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!slug) return;

        getProjectBySlug(slug).then((p) => {
            if (p) setProject(p);
            setLoading(false);
        });
    }, [slug]);

    const onSubmit = async (data: Project) => {
        setIsSubmitting(true);
        try {
            // Update existing doc
            const docRef = doc(db, "projects", slug!);
            await updateDoc(docRef, { ...data });

            alert("Project updated successfully!");
            router.push("/admin");
        } catch (error) {
            console.error(error);
            alert("Error updating project");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!slug) return <div className="p-12 text-white">No project specified.</div>;
    if (loading) return <div className="p-12 text-white">Loading...</div>;
    if (!project) return <div className="p-12 text-white">Project not found.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Project</h1>
                    <span className="text-slate-500 font-mono text-sm">{slug}</span>
                </div>

                <ProjectForm initialData={project} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}

export default function EditProjectPage() {
    return (
        <Suspense fallback={<div className="p-12 text-white">Loading Editor...</div>}>
            <EditProjectContent />
        </Suspense>
    );
}
