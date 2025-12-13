"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Post } from "@/lib/writing";
import { subscribeToPost } from "@/lib/subscriptions";

interface PostContentProps {
    initialPost: Post;
}

export default function PostContent({ initialPost }: PostContentProps) {
    const [post, setPost] = useState<Post>(initialPost);

    useEffect(() => {
        const unsubscribe = subscribeToPost(initialPost.slug, (updatedPost) => {
            if (updatedPost) {
                setPost(updatedPost);
            }
        });
        return () => unsubscribe();
    }, [initialPost.slug]);

    if (!post) return null;

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-200 py-24 px-6 md:px-12 selection:bg-indigo-500/30">
            <article className="max-w-3xl mx-auto">
                <Link href="/writing" className="text-indigo-400 hover:text-indigo-300 font-mono text-sm mb-8 inline-block">
                    ← Back to Index
                </Link>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-neutral-500 font-mono text-sm">
                        <span>{post.date}</span>
                        {post.subtitle && (
                            <>
                                <span>/</span>
                                <span className="text-indigo-400">{post.subtitle}</span>
                            </>
                        )}
                    </div>
                </header>

                <div className="prose prose-invert prose-lg prose-indigo max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
