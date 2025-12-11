"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface MetricItem {
    label: string;
    value: string;
    description: string;
    color?: string; // Optional hex or tailwind class
}

interface MetricsScrollProps {
    metrics: MetricItem[];
}

/**
 * MetricsScroll
 *
 * Implements a "Scrollytelling" effect where metrics snap into view
 * and persist while their context changes or background elements shift.
 *
 * Uses:
 * - CSS Sticky for layout mechanics.
 * - Framer Motion for enter/exit animations linked to scroll position.
 */
export const MetricsScroll: React.FC<MetricsScrollProps> = ({ metrics }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="relative bg-slate-950">
            {metrics.map((metric, index) => {
                return (
                    <MetricSection
                        key={index}
                        metric={metric}
                        index={index}
                        total={metrics.length}
                        parentProgress={scrollYProgress}
                    />
                );
            })}
        </div>
    );
};

interface MetricSectionProps {
    metric: MetricItem;
    index: number;
    total: number;
    parentProgress: MotionValue<number>;
}

const MetricSection: React.FC<MetricSectionProps> = ({ metric }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax / Fade effects based on local section scroll
    const opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.8, 0.9], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.4, 0.5, 0.8], [0.8, 1, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section
            ref={sectionRef}
            className="h-screen sticky top-0 flex items-center justify-center overflow-hidden border-t border-slate-900/50"
        >
            {/* Background Element (Abstract Shape) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <motion.div
                    className="w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-900 to-purple-900 blur-3xl"
                    style={{ y }}
                />
            </div>

            {/* Content */}
            <motion.div
                style={{ opacity, scale }}
                className="relative z-10 text-center max-w-4xl px-6"
            >
                <h2 className="text-sm md:text-lg font-mono text-indigo-400 mb-4 tracking-widest uppercase">
                    {metric.label}
                </h2>
                <div className="text-[12vw] md:text-[8rem] font-black tracking-tighter text-white leading-none mb-6">
                    {metric.value}
                </div>
                <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-light">
                    {metric.description}
                </p>
            </motion.div>
        </section>
    );
};
