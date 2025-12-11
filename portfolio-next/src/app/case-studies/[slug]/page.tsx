import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/data";
import { ResourceAllocationGrid } from "@/components/case-study/ResourceAllocationGrid";
import { MetricsScroll } from "@/components/case-study/MetricsScroll";

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Case Study`,
        description: project.subtitle,
        openGraph: {
            title: project.title,
            description: project.overview,
            images: [project.coverImage],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // Determine if we should show the mastery component
    const showMastery = project.slug === "midwest-underground-ops";

    return (
        <main className="bg-slate-950 min-h-screen text-slate-200 selection:bg-indigo-500/30">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[80vh] flex items-end pb-24 px-6 md:px-12 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl w-full mx-auto">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6">
                        {project.title}
                    </h1>
                    <p className="text-xl md:text-3xl text-indigo-300 font-light max-w-2xl">
                        {project.subtitle}
                    </p>
                </div>
            </section>

            {/* --- OVERVIEW --- */}
            <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">The Challenge</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{project.challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">Overview</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{project.overview}</p>
                    </div>
                </div>

                <div className="space-y-8 border-l border-slate-800 pl-8 h-fit sticky top-24">
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Role</h3>
                        <ul className="space-y-1">
                            {project.role.map((r) => (
                                <li key={r} className="text-slate-200">{r}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((t) => (
                                <span key={t} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-indigo-200">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SCROLLYTELLING METRICS --- */}
            <MetricsScroll metrics={project.impact} />

            {/* --- MASTERPIECE / TECHNICAL DEEP DIVE --- */}
            <section className="py-32 px-6 md:px-12 bg-slate-900/30 border-y border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 mb-16">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Technical Deep Dive</h2>
                            <div className="h-1 w-20 bg-indigo-500 mb-8" />
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {project.technicalDeepDive}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500 font-mono text-sm text-center">
                                Architecture Diagram / Schema Visualization<br />(Placeholder)
                            </p>
                        </div>
                    </div>

                    {/* Interactive Component Showcase */}
                    {showMastery && (
                        <div className="mt-24 space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
                                    Interactive Demo
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Live Resource Management</h3>
                                <p className="text-slate-400">
                                    Interact with the actual component logic used to manage field crews.
                                    Try filtering crews or clicking cards to update status.
                                </p>
                            </div>

                            <ResourceAllocationGrid />
                        </div>
                    )}
                </div>
            </section>

            {/* --- FOOTER NAV --- */}
            <section className="py-24 text-center">
                <p className="text-slate-500 mb-4">Next Project</p>
                <h3 className="text-2xl md:text-4xl font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer">
                    View All Engagements
                </h3>
            </section>
        </main>
    );
}
