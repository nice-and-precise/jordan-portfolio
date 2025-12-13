"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ImpactTickerProps {
    value: string; // e.g. "14%", "$500k", "99.9%"
    label: string;
    description?: string;
    delay?: number;
    className?: string;
    valueClassName?: string;
    frameless?: boolean;
}

export default function ImpactTicker({ value, label, description, delay = 0, className = "", valueClassName = "", frameless = false }: ImpactTickerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    // Parse the numeric part and the suffix/prefix
    const match = value.match(/([^\d\.]*)([\d\.]+)([^\d\.]*)/);
    const prefix = match ? match[1] : "";
    const numberVal = match ? parseFloat(match[2]) : 0;
    const suffix = match ? match[3] : "";

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2000
    });

    // State to hold the displayed string
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                springValue.set(numberVal);
            }, delay * 1000);
        }
    }, [isInView, numberVal, springValue, delay]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            // Check for decimals in original string to determine precision
            const hasDecimal = value.includes(".");
            if (hasDecimal) {
                setDisplayValue(latest.toFixed(1));
            } else {
                setDisplayValue(Math.round(latest).toString());
            }
        });
    }, [springValue, value]);

    const containerClasses = frameless
        ? `relative group ${className}`
        : `bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group ${className}`;

    const textClasses = valueClassName || "text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight";

    return (
        <div ref={ref} className={containerClasses}>
            {!frameless && <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay }}
                className="relative z-10"
            >
                <div className={textClasses}>
                    <span className="text-blue-500">{prefix}</span>
                    {displayValue}
                    <span className="text-blue-500">{suffix}</span>
                </div>
                <div className="text-sm font-mono text-blue-400 uppercase tracking-wider mb-2">
                    {label}
                </div>
                {description && (
                    <div className="text-neutral-400 text-xs leading-relaxed max-w-[200px] mx-auto">
                        {description}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
