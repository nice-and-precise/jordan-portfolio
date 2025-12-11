import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/data";

export function SelectedEngagements({ projects }: { projects: Project[] }) {
    return (
        <section className="py-24 px-6 md:px-12 bg-[#050505] relative z-10" id="work">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Selected Engagements
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <Link
                            href={`/case-studies/${project.slug}`}
                            key={project.slug}
                            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-indigo-500/50 transition-colors"
                        >
                            <Image
                                src={project.coverImage}
                                fill
                                alt={project.title}
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                <span className="text-xs font-mono text-indigo-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    CONFIDENTIAL // 2024
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform group-hover:-translate-y-1">
                                    {project.title}
                                </h3>
                                <p className="text-slate-300 text-sm line-clamp-2 transform transition-transform group-hover:-translate-y-1 opacity-80 group-hover:opacity-100">
                                    {project.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
