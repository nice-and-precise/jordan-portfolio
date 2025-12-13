"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Project } from "@/lib/data";
import { subscribeToProject } from "@/lib/subscriptions";
import { CrewDashboard } from "@/components/case-study/CrewDashboard";
import { MetricsScroll } from "@/components/case-study/MetricsScroll";
import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { NonConformanceForm } from "@/components/case-study/NonConformanceForm";
import { GlobalMarketMap } from "@/components/case-study/GlobalMarketMap";
import { FloorFlowDashboard } from "@/components/case-study/floorflow/FloorFlowDashboard";

interface LiveCaseStudyProps {
    initialProject: Project;
}

function renderMasteryComponent(slug: string) {
    switch (slug) {
        case "midwest-underground-ops":
            return <CrewDashboard />;
        case "manufacturing-control-framework":
            return <NonConformanceForm />;
        case "global-market-research":
            return <GlobalMarketMap />;
        case "FloorFlow":
            return <FloorFlowDashboard />;
        default:
            return null;
    }
}

export default function LiveCaseStudy({ initialProject }: LiveCaseStudyProps) {
    const [project, setProject] = useState<Project>(initialProject);

    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = subscribeToProject(initialProject.slug, (updatedProject) => {
            if (updatedProject) {
                setProject(updatedProject);
            }
        });
        return () => unsubscribe();
    }, [initialProject.slug]);

    return (
        <main className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[80vh] flex items-end pb-24 px-6 md:px-12 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={project.coverImage || "/placeholder.jpg"}
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
                    <p className="text-xl md:text-3xl text-slate-400 font-light max-w-2xl">
                        {project.subtitle}
                    </p>
                </div>
            </section>

            {/* --- OVERVIEW --- */}
            <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-widest mb-4">The Challenge</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{project.challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-widest mb-4">Overview</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{project.overview}</p>
                    </div>
                </div>

                <div className="space-y-8 border-l border-slate-800 pl-8 h-fit sticky top-24">
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Role</h3>
                        <ul className="space-y-1">
                            {project.role?.map((r) => (
                                <li key={r} className="text-slate-200">{r}</li>
                            )) || <li className="text-slate-500">No roles listed</li>}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack?.map((t) => (
                                <span key={t} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
                                    {t}
                                </span>
                            )) || <span className="text-slate-500">No tech stack</span>}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SCROLLYTELLING METRICS --- */}
            <MetricsScroll metrics={project.impact || []} />

            {/* --- MASTERPIECE / TECHNICAL DEEP DIVE --- */}
            <section className="py-32 px-6 md:px-12 bg-slate-900/30 border-y border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 mb-16">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Technical Deep Dive</h2>
                            <div className="h-1 w-20 bg-emerald-500 mb-8" />
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {project.technicalDeepDive}
                            </p>
                        </div>
                        <div className="flex items-center justify-center bg-slate-950/50 rounded-2xl border border-slate-800/50 shadow-2xl relative overflow-hidden group">
                            <ArchitectureDiagram />
                        </div>
                    </div>

                    {/* Interactive Component Showcase */}
                    {renderMasteryComponent(project.slug) && (
                        <div className="mt-24 space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                                    Interactive Demo
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Live System Simulation</h3>
                                <p className="text-slate-400">
                                    This interactive component is connected to the production simulation engine.
                                    Explore the actual interface controls and real-time data visualizations used by operators.
                                </p>
                            </div>

                            <div className="md:p-4 rounded-3xl bg-slate-950/50 border border-slate-800 shadow-2xl overflow-hidden">
                                {renderMasteryComponent(project.slug)}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* --- FOOTER NAV --- */}
            <section className="py-24 text-center">
                <p className="text-slate-500 mb-4">Next Project</p>
                <h3 className="text-2xl md:text-4xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer">
                    View All Engagements
                </h3>
            </section>
        </main>
    );
}
