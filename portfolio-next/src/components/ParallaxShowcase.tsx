'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import for the modal to reduce initial bundle size
const ProjectModal = dynamic(() => import('./ProjectModal'), {
    ssr: false, // Modals are client-side only usually
});

// Mock Data for the showcase
const PROJECTS = [
    {
        id: 'asset-mgmt',
        title: 'AssetOS Control',
        description: 'A comprehensive fleet management solution handling 5,000+ heavy machinery assets. Features real-time telemetry, predictive maintenance modeling, and geospatial tracking on a low-latency React architecture.',
        image: '/images/uploaded_image_0_1765314769897.png',
        tags: ['React', 'D3.js', 'WebSockets', 'Mapbox'],
        stats: [
            { label: 'Latency', value: '< 50ms' },
            { label: 'Assets', value: '5,000+' }
        ]
    },
    {
        id: 'labor-grid',
        title: 'LaborForce Grid',
        description: 'Workforce optimization suite focusing on automated scheduling and compliance. Utilizes a drag-and-drop matrix interface built with virtualized lists for maximum performance.',
        image: '/images/uploaded_image_2_1765314769897.png',
        tags: ['Next.js', 'TanStack Table', 'PostgreSQL'],
        stats: [
            { label: 'Efficiency', value: '+35%' },
            { label: 'Users', value: '12k' }
        ]
    },
    {
        id: 'mobile-insp',
        title: 'Inspect Mobile',
        description: 'Offline-first progressive web app for field safety inspections. Syncs background data automatically when connection is restored. Biometric auth and camera integration.',
        image: '/images/uploaded_image_1_1765314769897.png',
        tags: ['PWA', 'Service Workers', 'IndexedDB'],
        stats: [
            { label: 'Offline', value: '100%' },
            { label: 'Sync', value: 'Auto' }
        ]
    }
];

const ParallaxShowcase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

    // Transforms for the "Exploded" view

    // Layer 1: The Base (Asset Management)
    const rotateX1 = useTransform(smoothProgress, [0, 0.5, 1], [0, 45, 60]);
    const scale1 = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.9, 0.8]);
    const y1 = useTransform(smoothProgress, [0, 1], [0, 200]);
    const opacity1 = useTransform(smoothProgress, [0.8, 1], [1, 0]);

    // Layer 2: The Mid (Labor)
    const y2 = useTransform(smoothProgress, [0.2, 0.8], [800, -50]);
    const rotateY2 = useTransform(smoothProgress, [0.2, 0.8], [-20, 0]);
    const rotateX2 = useTransform(smoothProgress, [0.2, 0.8], [20, 0]);
    const scale2 = useTransform(smoothProgress, [0.2, 0.8], [0.8, 1]);

    // Layer 3: The Top (Mobile Inspection)
    const x3 = useTransform(smoothProgress, [0.4, 0.9], [1200, 200]);
    const rotateZ3 = useTransform(smoothProgress, [0.4, 0.9], [15, -5]);
    const scale3 = useTransform(smoothProgress, [0.4, 0.9], [1.2, 1]);


    // Magnetic Tilt Logic usage
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    };

    const tiltX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const tiltY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    // Modal State
    const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

    return (
        <div ref={containerRef} className="h-[300vh] bg-neutral-900 relative">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000" onMouseMove={handleMouseMove}>

                {/* Ambient Light/Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />

                {/* Content Container with Mouse Tilt */}
                <motion.div
                    style={{ rotateX: tiltX, rotateY: tiltY }}
                    className="relative w-full max-w-6xl h-full flex items-center justify-center perspective-1000 transform-style-3d"
                >

                    {/* Layer 1: Asset Management (Base) */}
                    <motion.div
                        layoutId={`project-container-${PROJECTS[0].id}`}
                        onClick={() => setSelectedProject(PROJECTS[0])}
                        style={{ rotateX: rotateX1, scale: scale1, y: y1, opacity: opacity1 }}
                        className="absolute w-[90%] md:w-[70%] max-w-[1000px] aspect-video bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border border-white/5 z-10 hover:border-emerald-500/50 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] transition-colors duration-500 cursor-pointer group"
                    >
                        <motion.div layoutId={`project-image-${PROJECTS[0].id}`} className="relative w-full h-full">
                            <Image src={PROJECTS[0].image} alt="Asset Management" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute bottom-5 left-5 text-emerald-400 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            EXPAND_SYS_VIEW({PROJECTS[0].id})
                        </div>
                    </motion.div>

                    {/* Layer 2: Labor Management (Mid) */}
                    <motion.div
                        layoutId={`project-container-${PROJECTS[1].id}`}
                        onClick={() => setSelectedProject(PROJECTS[1])}
                        style={{ y: y2, rotateX: rotateX2, rotateY: rotateY2, scale: scale2 }}
                        className="absolute w-[80%] md:w-[60%] max-w-[900px] aspect-video bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20 hover:border-orange-500/50 hover:shadow-[0_0_50px_-10px_rgba(249,115,22,0.3)] transition-colors duration-500 cursor-pointer group"
                    >
                        <motion.div layoutId={`project-image-${PROJECTS[1].id}`} className="relative w-full h-full">
                            <Image src={PROJECTS[1].image} alt="Labor Management" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </motion.div>
                        <div className="absolute inset-0 ring-1 ring-white/10" />
                        <div className="absolute bottom-5 left-5 text-orange-400 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            ACCESS_LABOR_GRID({PROJECTS[1].id})
                        </div>
                    </motion.div>

                    {/* Layer 3: Mobile (Top) */}
                    <motion.div
                        layoutId={`project-container-${PROJECTS[2].id}`}
                        onClick={() => setSelectedProject(PROJECTS[2])}
                        style={{ x: x3, rotateZ: rotateZ3, scale: scale3 }}
                        className="absolute right-[10%] w-[30%] max-w-[350px] aspect-[9/19] bg-black rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-neutral-800 z-30 hover:border-neutral-600 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] transition-all duration-500 cursor-pointer group"
                    >
                        <motion.div layoutId={`project-image-${PROJECTS[2].id}`} className="relative w-full h-full">
                            <Image src={PROJECTS[2].image} alt="Mobile Inspection" fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </motion.div>
                        {/* Screen Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded">
                            MOBILE_INSPECT
                        </div>
                    </motion.div>

                </motion.div>

                <div className="absolute bottom-10 left-10 text-white/50 text-sm font-mono">
                    SCROLL TO EXPLORE ARCHITECTURE_
                </div>
            </div>

            {/* Render the Project Modal */}
            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </div>
    );
};

export default ParallaxShowcase;
