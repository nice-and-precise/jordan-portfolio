'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SiteSettings } from '@/lib/settings';

export default function FloatingNav({ settings }: { settings?: SiteSettings }) {
    const [isVisible, setIsVisible] = useState(false);

    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            // Visibility Logic
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Scroll Spy Logic
            const sections = ['work', 'contact'];
            let current = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) { // Offset for header
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-6 inset-x-0 z-[100] flex justify-center pointer-events-none"
                >
                    <div className="pointer-events-auto bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={`text-sm font-bold transition-colors ${activeSection === 'home' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {settings?.navHomeLabel || settings?.heroTitle || 'HOME'}
                        </button>

                        <div className="w-px h-4 bg-white/10" />

                        <Link
                            href="/about"
                            className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            {settings?.navAboutLabel || "About"}
                        </Link>

                        <div className="w-px h-4 bg-white/10" />

                        <button
                            onClick={() => scrollTo('work')}
                            className={`hidden md:block text-sm transition-colors uppercase tracking-wider ${activeSection === 'work' ? 'text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                        >
                            {settings?.navWorkLabel || "Work"}
                        </button>
                        <button
                            onClick={() => scrollTo('contact')}
                            className={`hidden md:block text-sm transition-colors uppercase tracking-wider ${activeSection === 'contact' ? 'text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                        >
                            {settings?.navContactLabel || "Contact"}
                        </button>

                        {settings?.resumeUrl && (
                            <>
                                <div className="w-px h-4 bg-white/10" />
                                <a
                                    href={settings.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    {settings?.navResumeLabel || "RESUME"}
                                </a>
                            </>
                        )}

                        <div className="w-px h-4 bg-white/10" />

                        <a
                            href="/admin"
                            className="text-xs text-slate-600 hover:text-slate-400"
                        >
                            {settings?.navCmsLabel || "CMS"}
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
