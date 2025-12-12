'use client';

import { motion } from 'framer-motion';
import {
    Bot,
    TrendingUp,
    Workflow,
    Database,
    Zap,
    ShieldCheck,
    Activity,
    Code2,
    Cpu,
    Globe,
    Server,
    Smartphone
} from 'lucide-react';
import { Service } from '@/lib/data';

// Map string names to components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
    'Bot': Bot,
    'TrendingUp': TrendingUp,
    'Workflow': Workflow,
    'Database': Database,
    'Zap': Zap,
    'ShieldCheck': ShieldCheck,
    'Activity': Activity,
    'Code2': Code2,
    'Cpu': Cpu,
    'Globe': Globe,
    'Server': Server,
    'Smartphone': Smartphone
};

export default function BentoServices({ services }: { services?: Service[] }) {
    // If services are passed (from Firestore or Fallback in data.ts), use them.
    // If for some reason they are undefined, we render nothing or a safer fallback, 
    // but page.tsx handles the fallback via getStaticServices usually.
    // Given the props logic, let's just default to empty array if null.
    const displayServices = services || [];

    return (
        <section className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="text-blue-500 font-mono text-sm tracking-widest uppercase">Capabilities</span>
                <h2 className="text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                    Operational Architecture
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayServices.map((service, idx) => {
                    // Resolve icon: if it's a string, look it up. If missing, default to Zap.
                    const IconComponent = (service.icon && ICON_MAP[service.icon])
                        ? ICON_MAP[service.icon]
                        : Zap;

                    return (
                        <motion.div
                            key={service.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/10 p-8
                hover:border-blue-500/30 transition-colors duration-500
                ${service.colSpan === 2 ? 'md:col-span-2' : ''}
              `}
                        >
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                        <IconComponent size={24} />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed">{service.description}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Impact</span>
                                    <span className="text-lg font-bold text-white relative">
                                        {service.impact}
                                        <div className="absolute -bottom-1 left-0 w-full h-px bg-blue-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
