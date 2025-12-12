'use client';

import React from 'react';
import { motion } from 'framer-motion';
import InefficiencyCalculator from '@/components/InefficiencyCalculator';

export default function MethodologySection() {
    return (
        <section className="relative z-10 py-24 px-4 bg-neutral-900/30 border-y border-white/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">The Methodology</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
                            Six Sigma Precision.<br />
                            <span className="text-neutral-500">Startup Velocity.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                            Most digital transformations fail because they add complexity. I remove it.
                            Using principles from <strong>Toyota Production System (Lean)</strong> and <strong>Kaizen</strong>,
                            I architect software that eliminates &quot;muda&quot; (waste) from your operations.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Eliminate Manual Data Entry",
                                "Reduce Decision Latency",
                                "Systematize Quality Control"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Metric/Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                        <div className="relative bg-black border border-white/10 rounded-2xl p-8">
                            <div className="text-7xl font-black text-white mb-2">99.9%</div>
                            <div className="text-neutral-500 font-mono uppercase tracking-wider">Process Reliability</div>
                        </div>
                        <div className="relative bg-black border border-white/10 rounded-2xl p-8 mt-4 ml-12">
                            <div className="text-7xl font-black text-white mb-2">&lt;100ms</div>
                            <div className="text-neutral-500 font-mono uppercase tracking-wider">Interaction Latency</div>
                        </div>
                    </motion.div>
                </div>

                {/* Calculator Integration */}
                <div id="calculator" className="scroll-mt-20">
                    <InefficiencyCalculator />
                </div>

            </div>
        </section>
    );
}
