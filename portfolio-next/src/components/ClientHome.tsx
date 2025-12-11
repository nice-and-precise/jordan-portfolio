'use client';

import dynamic from 'next/dynamic';
import ContactForm from "@/components/ContactForm";
import { Project } from '@/lib/data';

// Dynamic imports with SSR disabled to eliminate hydration mismatches
const AntigravityHero = dynamic(() => import('@/components/AntigravityHero'), { ssr: false });
const ParallaxShowcase = dynamic(() => import('@/components/ParallaxShowcase'), { ssr: false });
const StickyProjectStack = dynamic(() => import('@/components/StickyProjectStack').then(mod => mod.StickyProjectStack), { ssr: false });

interface ClientHomeProps {
    projects: Project[];
}

export default function ClientHome({ projects }: ClientHomeProps) {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <AntigravityHero />
            <ParallaxShowcase />

            {/* Selected Engagements - Sticky Stack Transformation */}
            <StickyProjectStack projects={projects} />

            {/* Footer / Connect Section */}
            <section className="h-[50vh] flex flex-col items-center justify-center p-10 bg-neutral-900 border-t border-white/5 relative z-10">
                <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Engineered for Impact.
                </h2>
                <p className="text-white/60 max-w-xl text-center mb-10">
                    Let&apos;s build something that defies expectations. My approach combines rigorous engineering with fluid, organic design.
                </p>
                <div className="flex flex-col items-center gap-6">
                    <ContactForm />
                    <a
                        href="https://github.com/nice-and-precise"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-white transition-colors text-sm"
                    >
                        github.com/nice-and-precise -&gt;
                    </a>
                </div>
            </section>
        </main>
    );
}
