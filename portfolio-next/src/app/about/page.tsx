import React from 'react';
import type { Metadata } from 'next';
import AboutProfileImage from '@/components/ui/AboutProfileImage';

export const metadata: Metadata = {
    title: 'About | Operational Precision. Technical Scalability.',
    description: 'Operational Strategist and Developer bridging the gap between "sweaty equity" manufacturing and digital scale.',
};

export default function AboutPage() {
    const keySkills = [
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

            <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center min-h-[80vh]">

                    {/* Left Col: Narrative */}
                    <div className="md:col-span-7 space-y-8">
                        <div>
                            <span className="text-emerald-500 font-mono text-xs tracking-[0.2em] uppercase mb-4 block animate-fade-in">
                                The Operator's Mindset
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500">
                                Operational Precision. <br />
                                Technical Scalability.
                            </h1>
                        </div>

                        <div className="space-y-6 text-lg text-neutral-400 leading-relaxed max-w-2xl">
                            <p>
                                I am an Operational Strategist and Developer who understands that code is only as good as the process it supports. My background isn't typical for tech, and that's my advantage.
                            </p>
                            <p>
                                With over 15 years in high-stakes environments—from commanding fire crews as a Lieutenant to optimizing high-volume manufacturing logistics—I've learned that reliability isn't an accident; it's engineered.
                            </p>
                            <p>
                                Today, I leverage AI Agents and Process Intelligence to help businesses scale. I don't just theorize about 'uptime'; I have managed it on the fireground and the factory floor. I operate with the mindset of a business owner, building tools that work and systems that last.
                            </p>
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
        </main>
    );
}
