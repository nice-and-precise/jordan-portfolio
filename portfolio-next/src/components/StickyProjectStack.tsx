"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/data";

interface Props {
    projects: Project[];
}

export function StickyProjectStack({ projects }: Props) {
    return (
        <div className="bg-[#050505] relative z-10 py-32" id="work">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
                >
                    Selected Engagements
                </motion.h2>
                <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-cyan-500" />
            </div>

            <div className="flex flex-col items-center">
                {(projects || []).map((project, i) => (
                    <Card key={project.slug} project={project} index={i} total={projects?.length || 0} />
                ))}
            </div>
        </div>
    );
}

function Card({ project, index, total }: { project: Project; index: number; total: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - index) * 0.05]);

    // If it's the last card, we don't want it to scale down or move
    const isLast = index === total - 1;

    if (!project) return null;

    return (
        <div ref={container} className="h-[150vh] w-full sticky top-0 flex items-center justify-center">
            <motion.div
                style={{
                    scale: isLast ? 1 : scale,
                    top: `calc(15vh + ${index * 25}px)`
                }}
                className="flex flex-col relative w-full max-w-5xl h-[70vh] rounded-[2rem] bg-neutral-900 overflow-hidden border border-white/10 origin-top shadow-2xl"
            >
                <div className="grid md:grid-cols-2 h-full">
                    {/* Content Side */}
                    <div className="p-10 flex flex-col justify-between h-full bg-neutral-900/50 backdrop-blur-3xl z-10">
                        <div>
                            <div className="flex gap-2 flex-wrap mb-6">
                                {(project.role || []).map((r) => (
                                    <span key={r} className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-neutral-400">
                                        {r}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {project.title}
                            </h3>
                            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                                {project.overview ? project.overview.slice(0, 150) : ""}...
                            </p>
                            <ul className="space-y-4 mb-8">
                                {project.impact && project.impact.length > 0 ? project.impact.slice(0, 2).map((imp) => (
                                    <li key={imp.label} className="flex flex-col">
                                        <span className="text-2xl font-bold text-white">{imp.value}</span>
                                        <span className="text-sm text-neutral-500">{imp.label}</span>
                                    </li>
                                )) : null}
                            </ul>
                        </div>

                        <Link
                            href={`/case-studies/${project.slug}`}
                            className="inline-flex items-center gap-2 text-white font-bold hover:text-indigo-400 transition-colors group"
                        >
                            View Case Study
                            <span className="transform group-hover:translate-x-1 transition-transform">-&gt;</span>
                        </Link>
                    </div>

                    {/* Image Side */}
                    <div className="relative h-full w-full">
                        <Image
                            src={project.coverImage}
                            fill
                            alt={project.title}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-neutral-900/50 to-transparent" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
