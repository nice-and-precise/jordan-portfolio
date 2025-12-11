import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ContactForm from "@/components/ContactForm";
import { Project } from '@/lib/data';
import { SiteSettings } from '@/lib/settings';
import { subscribeToProjects, subscribeToSettings } from '@/lib/subscriptions';

// Dynamic imports with SSR disabled to eliminate hydration mismatches
const AntigravityHero = dynamic(() => import('@/components/AntigravityHero'), { ssr: false });
const ParallaxShowcase = dynamic(() => import('@/components/ParallaxShowcase'), { ssr: false });
const StickyProjectStack = dynamic(() => import('@/components/StickyProjectStack').then(mod => mod.StickyProjectStack), { ssr: false });
const FloatingNav = dynamic(() => import('@/components/FloatingNav'), { ssr: false });

interface ClientHomeProps {
    projects: Project[];
    settings?: SiteSettings;
}

export default function ClientHome({ projects: initialProjects, settings: initialSettings }: ClientHomeProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [settings, setSettings] = useState<SiteSettings | undefined>(initialSettings);

    // Real-time subscriptions
    useEffect(() => {
        // Subscribe to Projects
        const unsubProjects = subscribeToProjects((newProjects) => {
            // Only update if we have data (prevent flash of empty if something goes wrong, though snapshot usually sends initial)
            if (newProjects.length > 0) {
                setProjects(newProjects);
            }
        });

        // Subscribe to Settings
        const unsubSettings = subscribeToSettings((newSettings) => {
            setSettings(newSettings);
        });

        return () => {
            unsubProjects();
            unsubSettings();
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <FloatingNav settings={settings} />
            <AntigravityHero title={settings?.heroTitle} subtitle={settings?.heroSubtitle} />
            <ParallaxShowcase />

            <div id="work">
                <StickyProjectStack projects={projects} />
            </div>

            {/* Footer / Connect Section */}
            <section id="contact" className="min-h-[50vh] flex flex-col items-center justify-center p-10 bg-neutral-900 border-t border-white/5 relative z-10 w-full">
                <div className="max-w-3xl text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter">
                        Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">impossible.</span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
                        Ready to elevate your digital presence? I&apos;m currently open to new engineering challenges and creative partnerships.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                        <ContactForm />
                    </div>

                    <div className="flex items-center justify-center gap-8 pt-12 border-t border-white/5 w-full">
                        {settings?.footerLinks?.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-500 hover:text-white uppercase tracking-widest text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="pt-20 pb-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-slate-700 hover:text-emerald-500 transition-colors text-sm"
                        >
                            ↑ BACK TO TOP
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
