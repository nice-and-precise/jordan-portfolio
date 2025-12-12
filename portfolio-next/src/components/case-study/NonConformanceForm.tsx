"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Camera, Upload, Send, X, AlertOctagon, Sparkles, Brain, FileText, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NonConformanceForm = () => {
    const [step, setStep] = useState(1);
    const [severity, setSeverity] = useState<"low" | "medium" | "high" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [description, setDescription] = useState("Tolerance deviation detected on primary axis. Measurement: 10.042mm (Spec: 10.000mm ±0.01mm). Caused by suspected tool wear on CNC-04.");
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Dynamic Action Plan based on Severity
    const getActionPlan = () => {
        if (!severity) return null;
        if (severity === "low") return "Standard Rework: Return to line for minor calibration.";
        if (severity === "medium") return "Quarantine: Hold lot for 100% inspection. Notify Shift Lead.";
        if (severity === "high") return "Line Stop: Immediate production halt. Root cause analysis required by Quality Engineer.";
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAiAnalysis("Analysis suggests typical tool wear pattern consistent with 400hr maintenance cycle. Recommended classification: 'Equipment Degradation'. suggested routing: Maintenance Ticket #Auto-Gen.");
        setIsAnalyzing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-slate-900/50 border border-emerald-500/30 rounded-xl p-12 backdrop-blur-sm text-center flex flex-col items-center justify-center min-h-[500px]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">NCR #8829-X0 Submitted</h3>
                <p className="text-slate-400 max-w-md mb-8">
                    The quality assurance team has been notified. [REDACTED] Protocol initialized for lot quarantine.
                </p>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 w-full max-w-md text-left mb-8">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Next Steps</div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                        <span className="text-sm text-slate-300">Automated Maintenance Ticket #MT-492 created.</span>
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                        <span className="text-sm text-slate-300">Slack notification sent to #quality-control.</span>
                    </div>
                </div>

                <button
                    onClick={() => { setIsSuccess(false); setStep(1); setSeverity(null); setAiAnalysis(null); }}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                >
                    Submit Another Report
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Header */}
            <div className="bg-slate-950/50 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertOctagon className="w-5 h-5 text-red-500" />
                        Non-Conformance Report (NCR)
                    </h2>
                    <div className="text-xs font-mono text-slate-500 mt-1 flex gap-4">
                        <span>FORM-QC-2024-V9</span>
                        <span className="text-red-900/50 px-2 rounded bg-red-900/10 border border-red-900/20">CONFIDENTIAL // [REDACTED] INTERNAL</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Connection</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                {/* Section 1: Identification & Impact */}
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Part Number</label>
                                <input type="text" defaultValue="PN-8299-[REDACTED]" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected By</label>
                                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg p-2 pr-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">JD</div>
                                    <span className="text-sm text-slate-300">Station Inspector 04</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Defect Severity</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSeverity("low")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${severity === "low" ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-emerald-500/30'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-emerald-500 ${severity === "low" ? "animate-pulse" : ""}`} />
                                    <span className="text-xs font-bold">Minor</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSeverity("medium")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${severity === "medium" ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-amber-500/30'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-amber-500 ${severity === "medium" ? "animate-pulse" : ""}`} />
                                    <span className="text-xs font-bold">Major</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSeverity("high")}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${severity === "high" ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-red-500/30'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-red-500 ${severity === "high" ? "animate-pulse" : ""}`} />
                                    <span className="text-xs font-bold">Critical</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    <AnimatePresence>
                        {severity && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-800/50 border-l-4 border-indigo-500 p-4 rounded-r-lg"
                            >
                                <div className="text-xs font-bold text-indigo-400 uppercase mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3" /> System Recommended Action</div>
                                <p className="text-sm text-slate-200">{getActionPlan()}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Section 2: Description & Analysis */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Defect Description</label>
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !!aiAnalysis}
                                className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                            >
                                <Brain className="w-3 h-3" />
                                {isAnalyzing ? "Analyzing..." : "Auto-Analyze Root Cause"}
                            </button>
                        </div>

                        <textarea
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:border-indigo-500 outline-none resize-none leading-relaxed transition-all focus:ring-1 focus:ring-indigo-500/50"
                            placeholder="Describe the non-conformance in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <AnimatePresence>
                        {aiAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-lg relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-20"><Brain className="w-16 h-16 text-indigo-500" /></div>
                                <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Insight Detected</h4>
                                <p className="text-sm text-slate-300 relative z-10 leading-relaxed">
                                    {aiAnalysis}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Evidence */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence Attachment</label>
                        <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group hover:text-indigo-400">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                                <Camera className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium">Drag & Drop or Click to Upload Evidence</p>
                            <p className="text-xs opacity-50 mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Review & Sign Information */}
                <div className="space-y-6 border-t border-slate-800 pt-6">
                    <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
                        <h4 className="text-sm font-bold text-white mb-2 pb-2 border-b border-slate-800">Report Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-slate-500">Part:</span> <span className="text-slate-300">PN-8299-[REDACTED]</span></div>
                            <div><span className="text-slate-500">Severity:</span> <span className={`font-bold ${severity === 'high' ? 'text-red-400' : 'text-slate-300'} uppercase`}>{severity || "Pending"}</span></div>
                            <div className="col-span-2"><span className="text-slate-500">Action:</span> <span className="text-indigo-300">{getActionPlan() || "Pending Review"}</span></div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 p-4 rounded-lg flex items-start gap-3">
                        <Lock className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                            <h5 className="text-sm font-bold text-slate-200">Digital Signature Required</h5>
                            <p className="text-xs text-slate-500 mt-1 mb-3">By submitting this report, you certify that the information is accurate and complies with [REDACTED] ISO-9001 protocols.</p>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="sign" className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500" />
                                <label htmlFor="sign" className="text-sm text-slate-300 select-none cursor-pointer">I, <span className="font-mono text-white">System Inspector 04</span>, sign this report.</label>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Footer Navigation */}
                <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" className="px-6 py-3 text-slate-400 hover:text-white font-medium text-sm">Save Draft</button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    >
                        {isSubmitting ? "Submitting Protocol..." : (
                            <>
                                <Send className="w-4 h-4" /> Submit NCR
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
