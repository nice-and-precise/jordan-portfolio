'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SiteSettings } from '@/lib/settings';

export default function InefficiencyCalculator({ settings }: { settings?: SiteSettings }) {
    const [employees, setEmployees] = useState(50);
    const [hourlyRate, setHourlyRate] = useState(45);
    const [inefficiency, setInefficiency] = useState(20);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculation Logic
    // 2080 hours per year per employee
    const annualBurn = employees * hourlyRate * 2080;
    const wastedCapital = annualBurn * (inefficiency / 100);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Tie to Backend: Save lead/report to Firestore
            await addDoc(collection(db, 'leads'), {
                type: 'inefficiency_report',
                inputs: {
                    employees,
                    hourlyRate,
                    inefficiency
                },
                calculatedWaste: wastedCapital,
                email,
                timestamp: serverTimestamp()
            });

            setSubmitted(true);
        } catch (error) {
            console.error("Error saving report:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <div className="mb-8 text-center">
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-2">
                    {settings?.calculatorTitle || "Operational Waste Calculator"}
                </h3>
                <p className="text-neutral-400">{settings?.calculatorSubtitle || "Quantify the cost of chaos in your organization."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                    {/* Inputs */}
                    <div>
                        <label className="block text-sm font-mono text-neutral-500 mb-2 uppercase">{settings?.calcHeadcountLabel || "Headcount"}</label>
                        <input
                            suppressHydrationWarning
                            type="range"
                            min="5"
                            max="100"
                            value={employees}
                            onChange={(e) => setEmployees(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="text-right font-bold text-xl mt-1">{employees} Staff</div>
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-neutral-500 mb-2 uppercase">{settings?.calcRateLabel || "Avg Hourly Cost ($)"}</label>
                        <input
                            suppressHydrationWarning
                            type="range"
                            min="17"
                            max="100"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="text-right font-bold text-xl mt-1">${hourlyRate}/hr</div>
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-neutral-500 mb-2 uppercase">{settings?.calcInefficiencyLabel || "Inefficiency Est. (%)"}</label>
                        <input
                            suppressHydrationWarning
                            type="range"
                            min="5"
                            max="50"
                            value={inefficiency}
                            onChange={(e) => setInefficiency(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                        <div className="text-right font-bold text-xl mt-1 text-red-400">{inefficiency}%</div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center items-center bg-black/50 rounded-2xl p-6 border border-white/5">
                    <div className="text-sm text-neutral-500 mb-2">{settings?.calcBurnLabel || "Annual Capital Burned"}</div>
                    <motion.div
                        key={wastedCapital}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl md:text-5xl font-black text-red-500 tracking-tighter"
                    >
                        ${wastedCapital.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </motion.div>
                    <div className="text-xs text-neutral-600 mt-4 text-center">
                        {settings?.calcDisclaimer || "*Based on 2080 annual hours per employee."}
                    </div>
                </div>
            </div>

            {/* Lead Gen Form */}
            <AnimatePresence>
                {!submitted ? (
                    <motion.form
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSave}
                        className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10"
                    >
                        <input
                            suppressHydrationWarning
                            type="email"
                            required
                            placeholder={settings?.calcPlaceholder || "Enter email to save report..."}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (settings?.calcButtonText || "Get Remediation Plan")}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center text-green-400 font-bold"
                    >
                        {settings?.calcSuccessMessage || "Report Saved. I will analyze this data and contact you shortly."}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
