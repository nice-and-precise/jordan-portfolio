"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getPostBySlug, Post } from "@/lib/writing";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import PostForm from "@/components/admin/PostForm";

function EditPostContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams.get("slug");

    const [post, setPost] = useState<Post | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!slug) return;

        getPostBySlug(slug).then((p) => {
            if (p) setPost(p);
            setLoading(false);
        });
    }, [slug]);

    const onSubmit = async (data: Post) => {
        setIsSubmitting(true);
        try {
            const docRef = doc(db, "posts", slug!);
            await updateDoc(docRef, { ...data });

            alert("Post updated successfully!");
            router.push("/admin/writing");
        } catch (error) {
            console.error(error);
            alert("Error updating post");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!slug) return <div className="p-12 text-white">No post specified.</div>;
    if (loading) return <div className="p-12 text-white">Loading...</div>;
    if (!post) return <div className="p-12 text-white">Post not found.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Post</h1>
                    <span className="text-slate-500 font-mono text-sm">{slug}</span>
                </div>

                <PostForm initialData={post} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}

export default function EditPostPage() {
    return (
        <Suspense fallback={<div className="p-12 text-white">Loading Editor...</div>}>
            <EditPostContent />
        </Suspense>
    );
}
