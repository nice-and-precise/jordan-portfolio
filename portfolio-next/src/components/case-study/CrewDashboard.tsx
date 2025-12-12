"use client";

import React, { useState } from "react";
import { Clock, FileText, MapPin, Plus, Fuel, Wrench, Droplets, AlertTriangle, Users, TrendingUp } from "lucide-react";

export const CrewDashboard = () => {
    const [clockedIn, setClockedIn] = useState(false);
    const [activeTab, setActiveTab] = useState("fuel");
    const [fuelAmount, setFuelAmount] = useState("");

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 text-slate-200 font-sans p-4 md:p-8 rounded-xl border border-slate-900 shadow-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Crew Dashboard</h1>
                <p className="text-slate-400 text-sm">"Clock in, log production, and stay out of trouble with minimum taps."</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500"><Wrench className="w-4 h-4" /></span>
                        <h3 className="font-bold text-white text-sm">My Work: Today</h3>
                    </div>

                    {/* Status Cards */}
                    <div className="space-y-3">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Time Status</div>
                                <div className={`font-bold ${clockedIn ? 'text-emerald-400' : 'text-slate-200'}`}>
                                    {clockedIn ? "Clocked In (Active)" : "Not Clocked In"}
                                </div>
                            </div>
                            <button
                                onClick={() => setClockedIn(!clockedIn)}
                                className={`px-4 py-2 rounded font-bold text-xs uppercase transition-colors ${clockedIn ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white text-black hover:bg-slate-200'}`}
                            >
                                {clockedIn ? "Clock Out" : "Clock In"}
                            </button>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Daily Report</div>
                                <div className="font-bold text-slate-200">Not Started</div>
                            </div>
                            <button className="px-4 py-2 rounded bg-slate-800 text-white font-bold text-xs uppercase hover:bg-slate-700 transition-colors border border-slate-700">Create</button>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Next Location</div>
                                <div className="font-bold text-slate-200">No Assignment</div>
                            </div>
                            <MapPin className="text-slate-700" />
                        </div>
                    </div>

                    {/* Cost Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-4">
                            <div className="text-xs text-emerald-600 font-bold uppercase mb-1">Crew Cost (Today)</div>
                            <div className="text-2xl font-bold text-emerald-500">$0</div>
                        </div>
                        <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4">
                            <div className="text-xs text-blue-500 font-bold uppercase mb-1">Effective Rate</div>
                            <div className="text-2xl font-bold text-blue-400">$0.00<span className="text-sm font-normal text-slate-500">/hr</span></div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-4">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                            <Plus className="w-4 h-4" /> Log Rod
                        </button>
                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border border-slate-700">
                            <AlertTriangle className="w-4 h-4" /> Report Issue
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-white">Mississippi River Crossing</h2>
                            <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                                <MapPin className="w-3 h-3" /> St. Louis, MO
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-orange-500 font-bold uppercase">OWNER View</div>
                            <div className="text-xs text-slate-500">12/12/2025</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-900 p-1 rounded-lg">
                        <div className="flex-1 py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer">Today</div>
                        <div className="flex-1 py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer">Gear</div>
                        <div className="flex-1 py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer">Safety</div>
                        <div className="flex-1 py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer">Docs</div>
                    </div>

                    <div className="flex border-b border-slate-800">
                        <div className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 border-b-2 border-transparent cursor-pointer">Assets & Inspections</div>
                        <div className="px-6 py-2 text-xs font-bold text-white border-b-2 border-white cursor-pointer">Inventory</div>
                    </div>

                    {/* Inventory Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-white"><Wrench className="w-4 h-4" /> Job Inventory & Consumables</h4>
                            <Clock className="w-4 h-4 text-slate-600" />
                        </div>

                        {/* Subtabs */}
                        <div className="flex gap-2">
                            <button onClick={() => setActiveTab('fluids')} className={`flex-1 py-2 rounded border text-xs font-bold flex items-center justify-center gap-2 ${activeTab === 'fluids' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-transparent border-slate-800 text-slate-500'}`}><Droplets className="w-3 h-3" /> Fluids</button>
                            <button onClick={() => setActiveTab('fuel')} className={`flex-1 py-2 rounded border text-xs font-bold flex items-center justify-center gap-2 ${activeTab === 'fuel' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-transparent border-slate-800 text-slate-500'}`}><Fuel className="w-3 h-3" /> Fuel</button>
                            <button onClick={() => setActiveTab('parts')} className={`flex-1 py-2 rounded border text-xs font-bold flex items-center justify-center gap-2 ${activeTab === 'parts' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-transparent border-slate-800 text-slate-500'}`}><Wrench className="w-3 h-3" /> Parts</button>
                        </div>

                        {/* Input Area */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-2">Log Fuel Usage</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={fuelAmount}
                                    onChange={(e) => setFuelAmount(e.target.value)}
                                    placeholder="Gallons"
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                                />
                                <button className="bg-white text-black px-6 py-2 rounded font-bold text-xs uppercase hover:bg-slate-200">Log Diesel</button>
                            </div>
                        </div>

                        {/* Stock Levels */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-2">Current Stock Levels</label>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center">
                                    <span className="text-slate-300">2" HDPE SDR11</span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">5000 LF</span>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center">
                                    <span className="text-slate-300">4" HDPE SDR11</span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">2000 LF</span>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center">
                                    <span className="text-slate-300">Polymer Additive</span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">50 Jug</span>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center">
                                    <span className="text-slate-300">Pulling Eye 2"</span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">4 EA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tabs */}
            <div className="grid grid-cols-4 gap-4 mt-8">
                <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-red-900/30 transition-colors">
                    <TrendingUp className="w-5 h-5 text-red-500 mb-2" />
                    <span className="text-xs font-bold text-slate-300">Over Budget</span>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-900/30 transition-colors">
                    <Users className="w-5 h-5 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-slate-300">Active Crews</span>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-amber-900/30 transition-colors">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
                    <span className="text-xs font-bold text-slate-300">Incidents</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                    <FileText className="w-5 h-5 text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-300">Daily Reports</span>
                </div>
            </div>


            {/* Disclaimer Footer */}
            <div className="mt-8 border-t border-slate-900 pt-4">
                <p className="text-[10px] text-slate-600 font-mono text-center">
                    * DISCLAIMER: Information for demonstration only and not considered factual.
                </p>
            </div>
        </div >
    );
};
