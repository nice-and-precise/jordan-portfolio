"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Defined in settings.ts but duplicated here for component portability or imported if preferred
interface ExperienceItem {
    id: string;
    year: string;
    title: string;
    company: string;
    description: string;
}

interface ExperienceTimelineProps {
    items: ExperienceItem[];
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative max-w-4xl mx-auto py-24 px-6">
            {/* Central Timeline Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2">
                <motion.div
                    style={{ height: lineHeight }}
                    className="w-full bg-blue-500 box-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
            </div>

            <div className="space-y-24">
                {items.map((item, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Detailed Content Side */}
                            <div className="md:w-1/2 ml-12 md:ml-0">
                                <div className={`bg-neutral-900/50 border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-colors ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <h4 className="text-blue-400 font-mono text-sm mb-4">{item.company}</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline Node Center */}
                            <div className="absolute left-[20px] md:left-1/2 top-0 transform -translate-x-1/2 flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-black border-2 border-blue-500 z-10 box-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <div className="mt-2 text-xs font-mono font-bold text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-white/5">
                                    {item.year}
                                </div>
                            </div>

                            {/* Empty Space for Balance */}
                            <div className="md:w-1/2 hidden md:block" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
