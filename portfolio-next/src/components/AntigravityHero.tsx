'use client';

import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { MousePointer2, Move3d, Layers, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// A floating element that reacts to mouse proximity
const GravityItem = ({
  children,
  className,
  xInitial,
  yInitial,
  depth = 1
}: {
  children: React.ReactNode;
  className?: string;
  xInitial: number;
  yInitial: number;
  depth?: number;
}) => {
  const x = useSpring(xInitial, { stiffness: 100, damping: 20 });
  const y = useSpring(yInitial, { stiffness: 100, damping: 20 });

  // Random slight drift
  useEffect(() => {


    // Animate loop for drift
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      // Simple sine wave drift
      const driftX = Math.sin(time) * 10 * depth;
      const driftY = Math.cos(time * 0.8) * 10 * depth;

      x.set(xInitial + driftX);
      y.set(yInitial + driftY);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [depth, x, y, xInitial, yInitial]);

  // Handle Mouse Move on Window to create parallax/gravity effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) * 0.05 * depth;
      const moveY = (clientY - centerY) * 0.05 * depth;

      // We add this to the current spring target in a real implementation
      // For simplicity here, we just use the drift loop + mouse offset logic could be combined
      // But let's keep it simple: Mouse moves the "center" of gravity
      x.set(xInitial + moveX);
      y.set(yInitial + moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [depth, x, y, xInitial, yInitial]);

  return (
    <motion.div
      style={{ x, y }}
      className={cn("absolute p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl", className)}
    >
      {children}
    </motion.div>
  );
};

export default function AntigravityHero({ title = "GRAVITY", subtitle = "Engineering × Design" }: { title?: string, subtitle?: string }) {
  // Particles state to avoid hydration mismatch
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; depth: number }[]>([]);

  useEffect(() => {
    // Generate particles only on client
    const newParticles = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 800,
      depth: Math.random() * 3,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40, // Range -20 to 20px
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] text-white flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-80" />

      {/* Floating "Antigravity" Elements */}

      <GravityItem xInitial={-300} yInitial={-200} depth={2} className="border-neon-green/20">
        <Move3d className="w-8 h-8 text-emerald-400 mb-2" />
        <div className="text-sm font-mono text-emerald-400/80">PRECISION</div>
        <div className="text-xl font-bold">Physics_Ready</div>
      </GravityItem>

      <GravityItem xInitial={300} yInitial={-150} depth={1.5} className="border-orange-500/20">
        <Layers className="w-8 h-8 text-orange-400 mb-2" />
        <div className="text-sm font-mono text-orange-400/80">ARCHITECTURE</div>
        <div className="text-xl font-bold">Scalable_Systems</div>
      </GravityItem>

      <GravityItem xInitial={-250} yInitial={200} depth={1.2}>
        <Zap className="w-8 h-8 text-blue-400 mb-2" />
        <div className="text-sm font-mono text-blue-400/80">PERFORMANCE</div>
        <div className="text-xl font-bold">Turbo_Mode</div>
      </GravityItem>

      <GravityItem xInitial={350} yInitial={180} depth={2.5}>
        <MousePointer2 className="w-8 h-8 text-purple-400 mb-2" />
        <div className="text-sm font-mono text-purple-400/80">INTERACTION</div>
        <div className="text-xl font-bold">Fluid_UX</div>
      </GravityItem>

      {/* Variable Depth Particles */}
      {particles.map((p) => (
        <GravityItem key={p.id}
          xInitial={p.x}
          yInitial={p.y}
          depth={p.depth}
          className="p-2 rounded-full border-none bg-white/5 w-4 h-4"
        >
          <div />
        </GravityItem>
      ))}

      {/* Main Title - Static but overlaid */}
      <div className="z-10 text-center pointer-events-none mix-blend-exclusion px-4 relative">
        <motion.div
          animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent transform transition-transform duration-700">
            {title}
          </h1>
        </motion.div>
        <p className="text-lg md:text-2xl text-white/50 font-light tracking-widest uppercase mb-12">
          {subtitle}
        </p>

        {/* Navigation Buttons - Pointer Events Enabled */}
        <div className="pointer-events-auto flex items-center justify-center gap-6">
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95"
          >
            View Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-transparent hover:bg-white/5 border border-white/20 text-white/80 rounded-full font-medium transition-all hover:text-white"
          >
            Contact
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
