'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import EntropyParticles from '@/components/ui/EntropyParticles';
import BentoServices from '@/components/ui/BentoServices';
import MethodologySection from '@/components/MethodologySection';
import { HERO_VARIATIONS } from '@/lib/strategic-content';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Types for props passed from page.tsx (server component)
// Types for props passed from page.tsx (server component)
interface StrategicHomeProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    services?: any[];
}

export default function StrategicHome({ projects, settings, services }: StrategicHomeProps) {
    const [activeHero, setActiveHero] = useState<'aggressive' | 'empathetic' | 'visionary'>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (settings?.heroPersona as any) || 'aggressive'
    );
    const heroContent = HERO_VARIATIONS[activeHero];

    // Hero Fade Animation
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroY = useTransform(scrollY, [0, 500], [0, 200]); // Subtle parallax

    // Horizontal Scroll for Projects
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
            {/* BACKGROUND: Entropy to Order (Fades out on scroll) */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY }}
                className="fixed inset-0 z-0 pointer-events-none"
            >
                <EntropyParticles />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
            </motion.div>

            {/* HERO SECTION */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => {
                            const types: ('aggressive' | 'empathetic' | 'visionary')[] = ['aggressive', 'empathetic', 'visionary'];
                            const nextIndex = (types.indexOf(activeHero) + 1) % types.length;
                            setActiveHero(types[nextIndex]);
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-mono tracking-widest uppercase opacity-80">
                            {heroContent.badge}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        key={activeHero} // Animate on change
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500"
                    >
                        {heroContent.headline}
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        key={`${activeHero}-sub`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        {heroContent.subheadline}
                    </motion.p>

                    {/* CTA */}
                    {heroContent.cta && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105">
                                <span className="relative z-10 group-hover:text-white transition-colors">{heroContent.cta}</span>
                                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </button>
                        </motion.div>
                    )}

                    {/* Hero Switcher Prompt */}
                    <div className="mt-8 text-neutral-600 text-xs font-mono">
                        Click the badge to toggle narrative style (Current: {activeHero})
                    </div>
                </div>
            </section>

            {/* SELECTED ENGAGEMENTS (Moved Up & Animated) */}
            {projects && projects.length > 0 && (
                <section ref={targetRef} className="relative h-[130vh] md:h-auto bg-neutral-900 border-t border-white/10">
                    <div className="sticky top-0 flex h-screen items-center overflow-hidden md:relative md:h-auto md:block md:py-24 md:px-12 md:overflow-visible">

                        {/* Section Header */}
                        <div className="absolute top-12 left-6 z-20 md:static md:text-center md:mb-16 md:max-w-3xl md:mx-auto">
                            <h2 className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-4">Proof of Work</h2>
                            <h3 className="text-4xl md:text-6xl font-bold text-white">
                                Selected Engagements
                            </h3>
                            <p className="text-neutral-400 mt-2 md:hidden">Scroll to explore</p>
                            <p className="text-neutral-400 mt-4 text-lg hidden md:block">
                                Digital transformation initiatives delivering measurable ROI across manufacturing, utility, and financial sectors.
                            </p>
                        </div>

                        {/* Projects Container (Horizontal Scroll on Mobile, Grid on Desktop) */}
                        <motion.div
                            style={{ x }}
                            className="flex gap-8 px-4 items-center md:grid md:grid-cols-3 md:gap-8 md:px-0 md:!transform-none"
                        >
                            {/* Empty spacer for header offset (Mobile Only) */}
                            <div className="w-[10vw] flex-shrink-0 md:hidden" />

                            {projects.map((project) => (
                                <a
                                    key={project.slug}
                                    href={`/case-studies/${project.slug}`}
                                    className="group relative h-[60vh] w-[85vw] md:w-full md:h-[600px] flex-shrink-0 bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all shadow-2xl"
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={project.coverImage}
                                            alt={project.title}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 85vw, 33vw"
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                                            {project.techStack.slice(0, 3).map((tech: string) => (
                                                <span key={tech} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 backdrop-blur-md border border-white/10 text-white">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h4>
                                        <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed">
                                            {project.subtitle}
                                        </p>
                                        <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                                            View Case Study <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* SERVICES SECTION */}
            <BentoServices services={services} />

            {/* METHODOLOGY */}
            <MethodologySection />

        </main>
    );
}
