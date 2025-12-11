"use client";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/writing";
import PostForm from "@/components/admin/PostForm";
import { useState } from "react";

export default function NewPostPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: Post) => {
        setIsSubmitting(true);
        try {
            const slug = data.slug || data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const docRef = doc(db, "posts", slug);
            await setDoc(docRef, { ...data, slug });

            alert("Post created successfully!");
            router.push("/admin/writing");
        } catch (error) {
            console.error(error);
            alert("Error creating post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">New Post</h1>
                <PostForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
