'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TEAM_IMAGES = [
    '/assets/images/team/team-01.webp',
    '/assets/images/team/team-02.webp',
    '/assets/images/team/team-03.webp',
    '/assets/images/team/team-04.webp',
    '/assets/images/team/team-05.webp',
    '/assets/images/team/team-06.webp',
    '/assets/images/team/team-07.webp',
    '/assets/images/team/team-08.webp',
    '/assets/images/team/team-09.webp',
    '/assets/images/team/team-10.webp',
];

export default function TeamGallery() {
    return (
        <section className="py-24 bg-neutral-900 border-y border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-emerald-500 font-mono text-xs tracking-[0.2em] uppercase">Field Operations & Teamwork</span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
                    Built on Shared Success
                </h2>
                <p className="text-center text-neutral-400 max-w-2xl mx-auto">
                    No system scales in isolation. My approach is grounded in real-world collaboration, from the factory floor to the boardroom.
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full flex">
                {/* Fade Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

                <div className="flex w-full overflow-hidden">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 60,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        className="flex gap-4 md:gap-8 px-4 flex-nowrap"
                        style={{ width: "fit-content" }}
                    >
                        {/* Double the images for seamless loop */}
                        {[...TEAM_IMAGES, ...TEAM_IMAGES].map((src, index) => (
                            <div
                                key={index}
                                className="relative w-[300px] h-[200px] md:w-[400px] md:h-[300px] flex-shrink-0 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 ease-out border border-white/10"
                            >
                                <Image
                                    src={src}
                                    alt="Team collaboration"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 300px, 400px"
                                />
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
