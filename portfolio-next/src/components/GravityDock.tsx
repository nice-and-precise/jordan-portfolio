'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Home, LayoutGrid, Mail, Terminal, Cpu } from 'lucide-react';

export default function GravityDock() {
    const mouseX = useMotionValue(Infinity);

    return (
        <div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-2 md:gap-4 rounded-2xl bg-neutral-900/80 px-4 pb-3 border border-white/10 backdrop-blur-md shadow-2xl scale-75 md:scale-100 origin-bottom"
        >
            <DockIcon mouseX={mouseX} icon={<Home className="w-full h-full" />} label="Home" />
            <DockIcon mouseX={mouseX} icon={<LayoutGrid className="w-full h-full" />} label="Work" />
            <DockIcon mouseX={mouseX} icon={<Cpu className="w-full h-full" />} label="Stack" />
            <DockIcon mouseX={mouseX} icon={<Terminal className="w-full h-full" />} label="Labs" />

            <div className="w-[1px] h-full bg-white/10 mx-1" />

            <DockIcon mouseX={mouseX} icon={<Mail className="w-full h-full" />} label="Contact" />
        </div>
    );
}

function DockIcon({
    mouseX,
    icon,
    label
}: {
    mouseX: MotionValue<number>;
    icon: React.ReactNode;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const [hovered, setHovered] = React.useState(false);

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square rounded-full bg-black/50 border border-white/20 flex items-center justify-center relative group cursor-none" // cursor-none because we might want a custom cursor later, or standard pointer
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon Scale */}
            <motion.div className="w-6 h-6 text-white/70 group-hover:text-emerald-400 group-hover:scale-110 transition-colors">
                {icon}
            </motion.div>

            {/* Label Tooltip */}
            {hovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -15 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-8 text-[10px] font-mono tracking-widest text-emerald-400 bg-black/90 px-2 py-1 rounded border border-emerald-500/30 whitespace-nowrap"
                >
                    {label}
                </motion.div>
            )}

            {/* Active Dot (Mock) */}
            {label === 'Home' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-500" />}
        </motion.div>
    );
}
