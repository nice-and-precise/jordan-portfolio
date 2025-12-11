"use client";


import React, { useEffect, useState } from "react";
import { getAllPosts, Post } from "@/lib/writing";

export default function AdminWritingPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we are in client component but getAllPosts uses firebase/firestore (web SDK), it works.
        // But for build safety if getAllPosts uses incompatible Node stuff... it shouldn't.
        // Let's verify lib/writing.ts. It uses standard firebase/firestore imports.

        getAllPosts().then(data => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-12 text-white">Loading posts...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Writing (CMS)</h1>
                    <div className="flex gap-4">
                        <a href="/admin" className="px-6 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">← Dashboard</a>
                        <a href="/admin/writing/new" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors">
                            + New Post
                        </a>
                    </div>
                </div>

                <div className="grid gap-4">
                    {posts.map(post => (
                        <div key={post.slug} className="p-6 border border-slate-800 rounded-xl bg-slate-900/50 flex justify-between items-center group">
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                <p className="text-slate-500 text-sm">{post.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <a href={`/admin/writing/edit?slug=${post.slug}`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-white transition-colors">
                                    Edit
                                </a>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && <p className="text-slate-500">No posts found.</p>}
                </div>
            </div>
        </div>
    );
}
