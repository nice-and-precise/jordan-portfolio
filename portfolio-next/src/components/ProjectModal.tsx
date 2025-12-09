'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code2 } from 'lucide-react';
import Image from 'next/image';

interface ProjectDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        id: string;
        title: string;
        description: string;
        image: string;
        tags: string[];
        stats: { label: string; value: string }[];
    } | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectDetailsProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10"
                    >
                        {/* Modal Container */}
                        <motion.div
                            layoutId={`project-container-${project.id}`}
                            className="w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-3/5 relative h-64 md:h-auto bg-black">
                                <motion.div layoutId={`project-image-${project.id}`} className="absolute inset-0">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority // Valid since this is the main focus of the modal
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto">
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                            {project.title}
                                        </h2>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-xs font-mono text-white/60 border border-white/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-white/70 mb-8 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="grid grid-cols-2 gap-4 mb-8"
                                    >
                                        {project.stats.map((stat, i) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
                                                <div className="text-xl font-mono font-bold text-emerald-300">{stat.value}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex gap-3"
                                >
                                    <button className="flex-1 py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">
                                        <ExternalLink className="w-4 h-4" /> Live Demo
                                    </button>
                                    <button className="flex-1 py-3 bg-transparent border border-white/20 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                        <Code2 className="w-4 h-4" /> Case Study
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
