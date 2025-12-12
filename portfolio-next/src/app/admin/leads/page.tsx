"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LayoutDashboard, ArrowLeft, Loader2, DollarSign, Download, CheckCircle, Sparkles, Send, X, Bot } from "lucide-react";
import ParticleEffect from "@/components/ui/particle-effect-for-hero";
import { getSiteSettings } from "@/lib/settings";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

interface Lead {
    id: string;
    email: string;
    employees: number;
    avgRate: number;
    inefficiency: number;
    annualWaste: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timestamp: any;
    status: 'new' | 'contacted' | 'closed';
    strategy?: string; // Markdown content
}

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiKey, setApiKey] = useState<string>("");

    // AI State
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null); // For viewing strategy

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch Settings for API Key
                const settings = await getSiteSettings();
                if (settings.googleApiKey) setApiKey(settings.googleApiKey);

                // Fetch Leads
                const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
                const snapshot = await getDocs(q);
                const fetchedLeads = snapshot.docs.map(doc => ({
                    id: doc.id,
                    status: 'new',
                    ...doc.data()
                } as Lead));
                setLeads(fetchedLeads);
            } catch (error) {
                console.error("Error initializing:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const updateStatus = async (id: string, newStatus: Lead['status']) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        try {
            await updateDoc(doc(db, "leads", id), { status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const generateStrategy = async (lead: Lead) => {
        if (!apiKey) {
            alert("No Gemini API Key found. Please add it in Global Settings.");
            return;
        }

        setGeneratingId(lead.id);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
                Act as a Senior Operations Consultant. Analyze this prospect:
                - Employees: ${lead.employees}
                - Inefficiency Estimate: ${lead.inefficiency}%
                - Estimated Annual Waste: ${formatCurrency(lead.annualWaste)}
                
                Provide a short, punchy 3-step strategy to pitch our services to them. 
                Focus on the ROI of fixing this specific waste. 
                Tone: Professional, Direct, High-Value.
                Format: Markdown.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Save to Firestore
            await updateDoc(doc(db, "leads", lead.id), { strategy: text });

            // Update local state
            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, strategy: text } : l));
            setSelectedLead({ ...lead, strategy: text }); // Auto-open modal

        } catch (error) {
            console.error("AI Generation failed:", error);
            alert("Failed to generate strategy. Check console.");
        } finally {
            setGeneratingId(null);
        }
    };

    const downloadCSV = () => {
        const headers = ["ID", "Email", "Employees", "Avg Rate", "Inefficiency %", "Annual Waste", "Date", "Status"];
        const rows = leads.map(l => [l.id, l.email, l.employees, l.avgRate, l.inefficiency, l.annualWaste, l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000).toLocaleDateString() : 'N/A', l.status]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `inefficiency_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    // Email Template
    const getMailtoLink = (lead: Lead) => {
        const subject = `Opportunity: Reclaiming ${formatCurrency(lead.annualWaste)} in operational waste`;
        const body = `Hi,\n\nI noticed based on your team size of ${lead.employees}, you might be losing nearly ${formatCurrency(lead.annualWaste)} annually to operational inefficiencies.\n\nI'd love to share a quick strategy on how we can recapture that capital.\n\nBest,\nJordan`;
        return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative overflow-hidden">
            <ParticleEffect density={5} className="opacity-40 fixed inset-0" />

            {/* Top Navigation */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50 relative">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <a href="/admin" className="hover:text-emerald-400 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </a>
                        <h1 className="text-lg font-bold text-white tracking-tight ml-4">Leads & Inefficiency Reports</h1>
                    </div>
                    <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all text-sm">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 relative z-10">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Leads</p>
                            <p className="text-2xl font-bold text-white">{leads.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm">
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Potential Waste Identified</p>
                            <p className="text-2xl font-bold text-white">
                                {formatCurrency(leads.reduce((acc, curr) => acc + (curr.annualWaste || 0), 0))}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Actioned / Closed</p>
                            <p className="text-2xl font-bold text-white">
                                {leads.filter(l => l.status === 'closed').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/20">
                                    <th className="p-4 text-xs font-mono uppercase text-slate-500">Status</th>
                                    <th className="p-4 text-xs font-mono uppercase text-slate-500">Contact</th>
                                    <th className="p-4 text-xs font-mono uppercase text-slate-500">Metrics</th>
                                    <th className="p-4 text-xs font-mono uppercase text-slate-500 text-right">Waste/Yr</th>
                                    <th className="p-4 text-xs font-mono uppercase text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading leads...
                                        </td>
                                    </tr>
                                ) : leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">No leads captured yet.</td>
                                    </tr>
                                ) : (
                                    leads.map(lead => (
                                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-4 align-top">
                                                <select
                                                    value={lead.status}
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    onChange={(e) => updateStatus(lead.id, e.target.value as any)}
                                                    className={`
                                                        appearance-none cursor-pointer bg-transparent font-bold text-xs uppercase tracking-wider py-1 px-2 rounded
                                                        focus:bg-black focus:outline-none
                                                        ${lead.status === 'new' ? 'text-blue-400 border border-blue-400/30' : ''}
                                                        ${lead.status === 'contacted' ? 'text-yellow-400 border border-yellow-400/30' : ''}
                                                        ${lead.status === 'closed' ? 'text-emerald-400 border border-emerald-400/30' : ''}
                                                    `}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                                <div className="mt-2 text-xs text-slate-600">
                                                    {lead.timestamp?.seconds ? new Date(lead.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="font-bold text-white mb-1">{lead.email}</div>
                                                <a
                                                    href={getMailtoLink(lead)}
                                                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    <Send className="w-3 h-3" /> Email Lead
                                                </a>
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm align-top">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-slate-600">Stack:</div>
                                                    <div className="text-slate-300">{lead.employees} emp</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-slate-600">Rate:</div>
                                                    <div className="text-slate-300">${lead.avgRate}/hr</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-slate-600">Drag:</div>
                                                    <div className="text-slate-300 font-mono text-red-500">{lead.inefficiency}%</div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-red-400 font-mono text-right font-bold text-lg align-top">
                                                {formatCurrency(lead.annualWaste)}
                                            </td>
                                            <td className="p-4 align-top text-right">
                                                {lead.strategy ? (
                                                    <button
                                                        onClick={() => setSelectedLead(lead)}
                                                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 ml-auto"
                                                    >
                                                        <Bot className="w-3 h-3" /> View Strategy
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => generateStrategy(lead)}
                                                        disabled={generatingId === lead.id}
                                                        className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                                                    >
                                                        {generatingId === lead.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Sparkles className="w-3 h-3 text-purple-600" />
                                                        )}
                                                        Generate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Strategy Modal */}
                {selectedLead && selectedLead.strategy && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
                        <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-500" />
                                        Strategic Analysis
                                    </h3>
                                    <p className="text-sm text-slate-400">Target: {selectedLead.email}</p>
                                </div>
                                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{selectedLead.strategy}</ReactMarkdown>
                            </div>
                            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                                <button onClick={() => setSelectedLead(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Close</button>
                                <a
                                    href={getMailtoLink(selectedLead)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Send Proposal
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
