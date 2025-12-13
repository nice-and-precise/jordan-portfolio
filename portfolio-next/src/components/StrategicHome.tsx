'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import EntropyParticles from '@/components/ui/EntropyParticles';
import BentoServices from '@/components/ui/BentoServices';

import MethodologySection from '@/components/MethodologySection';
import { HERO_VARIATIONS } from '@/lib/strategic-content';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Types for props passed from page.tsx (server component)
import { SiteSettings } from '@/lib/settings';

interface StrategicHomeProps {
    projects?: any[]; // Keep as any for now or upgrade to Project[]
    settings?: SiteSettings;
    services?: any[];
}

export default function StrategicHome({ projects, settings, services }: StrategicHomeProps) {
    const [activeHero, setActiveHero] = useState<'aggressive' | 'empathetic' | 'visionary'>(
        settings?.heroPersona || 'aggressive'
    );

    // Real-Time Hydration
    const [liveProjects, setLiveProjects] = useState(projects || []);
    const [liveServices, setLiveServices] = useState(services || []);
    // Initialize with props or empty object to avoid undefined access
    const [liveSettings, setLiveSettings] = useState<SiteSettings>(settings || {} as SiteSettings);

    const heroContent = liveSettings?.heroVariations?.[activeHero] || HERO_VARIATIONS[activeHero];

    // Subscribe to real-time updates
    useEffect(() => {
        // Dynamic import to avoid server-side issues (though this is a client component)
        import('@/lib/subscriptions').then(({ subscribeToProjects, subscribeToSettings, subscribeToServices }) => {
            const unsubProjects = subscribeToProjects((data) => {
                setLiveProjects(data);
            });

            const unsubServices = subscribeToServices((data) => {
                setLiveServices(data);
            });

            const unsubSettings = subscribeToSettings((data) => {
                setLiveSettings(data);
                if (data.heroPersona) {
                    setActiveHero(data.heroPersona);
                }
            });

            return () => {
                unsubProjects();
                unsubSettings();
                unsubServices();
            };
        });
    }, []);

    // Hero Fade Animation
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroY = useTransform(scrollY, [0, 500], [0, 200]); // Subtle parallax



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
                        {liveSettings?.heroSwitcherInstruction || "Click the badge to toggle narrative style"} (Current: {activeHero})
                    </div>
                </div>
            </section>

            {/* SELECTED ENGAGEMENTS (Moved Up & Animated) */}
            {(liveProjects && liveProjects.length > 0 && (liveSettings?.showProjects ?? true)) && (
                <section id="work" className="relative bg-neutral-900 border-t border-white/10 py-12 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 md:px-12">

                        {/* Section Header */}
                        <div className="mb-12 md:mb-16 md:text-center md:max-w-3xl md:mx-auto">
                            <h2 className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-4">
                                {liveSettings?.projectsEyebrow || "Proof of Work"}
                            </h2>
                            <h3 className="text-4xl md:text-6xl font-bold text-white">
                                {liveSettings?.projectsTitle || "Selected Engagements"}
                            </h3>
                            <p className="text-neutral-400 mt-4 text-lg">
                                {liveSettings?.projectsSubtitle || "Digital transformation initiatives delivering measurable ROI across manufacturing, utility, and financial sectors."}
                            </p>
                        </div>

                        {/* Projects Container (Grid Layout) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {liveProjects.map((project, index) => (
                                <motion.a
                                    key={project.slug}
                                    href={`/case-studies/${project.slug}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative h-[500px] md:h-[600px] w-full flex-shrink-0 bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all shadow-2xl"
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={project.coverImage}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
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
                                            {liveSettings?.projectsButtonText || "View Case Study"} <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* TEASER: Who is Jordan? */}
            {(liveSettings?.showTeaser ?? true) && (
                <section className="py-24 bg-neutral-900 border-t border-white/5 relative overflow-hidden group">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={liveSettings?.teaserBackgroundUrl || "/assets/images/teaser-bg.webp"}
                            alt="Jordan in action"
                            fill
                            className="object-[center_35%] object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-neutral-900/40 group-hover:bg-neutral-900/30 transition-colors duration-700" />
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {liveSettings?.teaserTitle || "Who is Jordan?"}
                        </h2>
                        <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            {liveSettings?.teaserBody || "I bridge the gap between \"sweaty equity\" operations and digital scale."}
                        </p>
                        <a
                            href="/about"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            {liveSettings?.teaserCtaText || "Read My Story"} <span className="text-blue-600">→</span>
                        </a>
                    </div>
                </section>
            )}
            {/* CAPABILITIES / SERVICES (Bento Grid) */}
            {(liveSettings?.showCapabilities ?? true) && (
                <BentoServices services={liveServices} settings={liveSettings} />
            )}

            {/* METHODOLOGY */}
            {(liveSettings?.showMethodology ?? true) && (
                <MethodologySection settings={liveSettings} />
            )}

            {/* CONTACT SECTION */}
            {(liveSettings?.showContact ?? true) && (
                <section id="contact" className="py-24 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-white mb-8">
                            {liveSettings?.contactTitle || "Ready to Scale?"}
                        </h2>
                        <p className="text-neutral-400 mb-8">
                            {liveSettings?.contactSubtitle || "Let's build something state-of-the-art."}
                        </p>
                        <a href="mailto:jordandamhof@gmail.com" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                            {liveSettings?.contactButtonText || "Get in Touch"}
                        </a>
                    </div>
                </section>
            )}

        </main>
    );
}
