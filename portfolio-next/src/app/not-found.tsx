import Link from 'next/link';
import ParticleEffect from '@/components/ui/particle-effect-for-hero';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden selection:bg-rose-500/30">
            <ParticleEffect density={10} className="opacity-30" />

            <div className="z-10 text-center space-y-6 p-4">
                <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent">
                    404
                </h1>
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-bold text-white">
                        Gravity Lost.
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        The coordinates you requested are outside the known system.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all hover:scale-105"
                >
                    <Home className="w-4 h-4" />
                    Return to Orbit
                </Link>
            </div>

            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-80 pointer-events-none" />
        </div>
    );
}
