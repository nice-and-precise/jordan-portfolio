import React from "react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/writing";
import Link from "next/link";

// Debugging: Force static params to see if build detects it
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | Writing`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

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
