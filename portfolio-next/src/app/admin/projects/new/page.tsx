"use client";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/data";
import ProjectForm from "@/components/admin/ProjectForm";
import { useState } from "react";

export default function NewProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: Project) => {
        setIsSubmitting(true);
        try {
            // Basic slug generation if not provided (though form requires it, having fallback is good)
            const slug = data.slug || data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            const docRef = doc(db, "projects", slug);
            await setDoc(docRef, { ...data, slug });

            alert("Project saved successfully!");
            router.push("/admin");
        } catch (error) {
            console.error(error);
            alert("Error saving project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">New Project</h1>
                <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
