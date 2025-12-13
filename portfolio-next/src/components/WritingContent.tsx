"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Post } from "@/lib/writing";
import { subscribeToPosts } from "@/lib/subscriptions";

interface WritingContentProps {
    initialPosts: Post[];
}

export default function WritingContent({ initialPosts }: WritingContentProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    useEffect(() => {
        const unsubscribe = subscribeToPosts((updatedPosts) => {
            if (updatedPosts) {
                setPosts(updatedPosts);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-200 py-24 px-6 md:px-12 selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-16 tracking-tight">Writing.</h1>

                <div className="grid gap-12">
                    {posts.map(post => (
                        <Link key={post.slug} href={`/writing/${post.slug}`} className="group block border-t border-neutral-800 pt-8 hover:border-indigo-500/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h2>
                                <span className="text-neutral-500 font-mono text-sm mt-2 md:mt-0">{post.date}</span>
                            </div>
                            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed group-hover:text-neutral-300 transition-colors">
                                {post.excerpt}
                            </p>
                        </Link>
                    ))}

                    {posts.length === 0 && (
                        <div className="text-neutral-500 py-12">
                            Retrieving signals... (No posts found)
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
