'use client';

import React, { useEffect, useState } from 'react';
import AboutProfileImage from '@/components/ui/AboutProfileImage';
import TeamGallery from '@/components/ui/TeamGallery';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import { SiteSettings } from '@/lib/settings';

// Dynamic import for subscription to avoid SSR issues if any
// But for now typical import is fine if subscriptions.ts is safe.
// We'll use the same pattern as StrategicHome.
import { subscribeToSettings } from '@/lib/subscriptions'; // We might need to make this dynamic if it breaks build

export default function AboutContent({ initialSettings }: { initialSettings: SiteSettings }) {
    const [settings, setSettings] = useState<SiteSettings>(initialSettings);

    useEffect(() => {
        const unsub = subscribeToSettings((data) => {
            setSettings(data);
        });
        return () => unsub();
    }, []);

    const keySkills = settings.keySkills || [
        "Process Automation",
        "Crisis Management",
        "Full-Stack Development",
        "Team Leadership"
    ];

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-12 overflow-x-hidden selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Team Gallery Section (Top) */}
            <div className="relative z-10 mb-12 border-b border-white/5">
                <TeamGallery />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center min-h-[80vh]">

                    {/* Left Col: Narrative */}
                    <div className="md:col-span-7 space-y-8">
                        <div>
                            <span className="text-emerald-500 font-mono text-xs tracking-[0.2em] uppercase mb-4 block animate-fade-in">
                                {settings.aboutTitle || "The Operator's Mindset"}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 whitespace-pre-line">
                                {settings.aboutSubtitle || "Operational Precision.\nTechnical Scalability."}
                            </h1>
                        </div>

                        <div className="space-y-6 text-lg text-neutral-400 leading-relaxed max-w-2xl">
                            <p>{settings.aboutBody1}</p>
                            <p>{settings.aboutBody2}</p>
                            <p>{settings.aboutBody3}</p>
                        </div>

                        {/* Signature / Key Skills Grid */}
                        <div className="pt-8 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Core Competencies</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {keySkills.map((skill) => (
                                    <div key={skill} className="flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                                        <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                                            {skill}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Visual */}
                    <div className="md:col-span-5 relative mt-8 md:mt-0">
                        <AboutProfileImage />
                    </div>
                </div>
            </div>
            {/* Experience Timeline Section */}
            {(settings.experience && settings.experience.length > 0) && (
                <div className="relative z-10 py-24 bg-neutral-900/30 border-t border-white/5 mt-24">
                    <div className="container mx-auto px-6 text-center mb-16">
                        <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">Career Trajectory</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 text-white">Experience</h2>
                    </div>
                    <ExperienceTimeline items={settings.experience} />
                </div>
            )}
        </main>
    );
}
