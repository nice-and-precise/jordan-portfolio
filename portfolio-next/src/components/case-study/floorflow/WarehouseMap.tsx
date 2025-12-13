"use client";

import React, { useState } from 'react';
import { Worker, Task, SKU } from './types';
import { ZONES } from './constants';
import { User, Package, Zap, X, Activity, Calendar, Clock, MessageSquare, Battery, Wifi, ShieldCheck, Tablet, Watch, Smartphone } from 'lucide-react';

interface WarehouseMapProps {
    workers: Worker[];
    tasks: Task[];
    inventory: SKU[];
    onExpediteTask?: (taskId: string) => void;
    onMessageWorker?: (workerId: string) => void;
}

type SelectedItem =
    | { type: 'WORKER'; data: Worker }
    | { type: 'TASK'; data: Task };

export const WarehouseMap: React.FC<WarehouseMapProps> = ({
    workers,
    tasks,
    inventory,
    onExpediteTask,
    onMessageWorker
}) => {
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showTasks, setShowTasks] = useState(true);
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

    // Helper to check if task is late based on shipDeadline
    const isLate = (task: Task) => task.shipDeadline < Date.now();
    const isStalled = (task: Task) => (Date.now() - task.lastMoved) > 60000; // Stalled > 1 min (sim time)

    // Calculate target coordinate for visualization logic
    const getWorkerTarget = (worker: Worker): { x: number, y: number } | null => {
        const task = tasks.find(t => t.assignedTo === worker.id && ['ASSIGNED', 'IN_PROGRESS'].includes(t.status));
        if (!task) return null;

        // Manufacturing Logic (Target is next zone)
        if (task.type === 'MANUFACTURING') {
            if (task.stage === 'WELDING') return { x: ZONES.PAINT.x + 5, y: ZONES.PAINT.y + 20 };
            if (task.stage === 'PAINT') return { x: ZONES.ASSEMBLY.x + 5, y: ZONES.ASSEMBLY.y + 20 };
            if (task.stage === 'ASSEMBLY') return { x: ZONES.QA.x + 15, y: ZONES.QA.y + 10 };
            if (task.stage === 'QA') {
                return task.qualityCheck === 'FAIL'
                    ? { x: ZONES.REWORK.x + 10, y: ZONES.REWORK.y + 10 }
                    : { x: ZONES.STAGING.x + 20, y: ZONES.STAGING.y + 10 };
            }
            if (task.stage === 'REWORK') return { x: ZONES.QA.x + 5, y: ZONES.QA.y + 10 };
        }

        // Standard WMS Logic (Target is Task Location)
        return task.coordinate;
    };

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'TABLET': return <Tablet size={12} />;
            case 'WEARABLE': return <Watch size={12} />;
            case 'HANDHELD': return <Smartphone size={12} />;
            default: return null;
        }
    };

    // Convert path history array to SVG polyline points string
    const getPathString = (points: { x: number, y: number }[]) => {
        return points.map(p => `${p.x},${p.y}`).join(' ');
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col h-full relative min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Zap className="text-blue-500 w-4 h-4" /> Real-Time Production Map
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${showHeatmap ? 'bg-red-900/30 border-red-500 text-red-400' : 'border-slate-600 text-slate-500'}`}
                    >
                        HEATMAP
                    </button>
                    <button
                        onClick={() => setShowTasks(!showTasks)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${showTasks ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'border-slate-600 text-slate-500'}`}
                    >
                        ASSETS
                    </button>
                </div>
            </div>

            <div className="relative flex-1 bg-slate-950 rounded border border-slate-800 overflow-hidden" onClick={() => setSelectedItem(null)}>
                {/* SVG Map */}
                <svg viewBox="0 0 100 80" className="w-full h-full select-none">
                    {/* Defs for gradients and filters */}
                    <defs>
                        <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#334155" strokeWidth="0.1" opacity="0.5" />
                        </pattern>

                        <radialGradient id="heatGradient">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </radialGradient>

                        <filter id="glow-worker" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="glow-zone" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="0.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <rect width="100" height="80" fill="#020617" />
                    <rect width="100" height="80" fill="url(#grid)" />

                    {/* MANUFACTURING ZONES (G3 "Google Maps" Layer) */}
                    {Object.entries(ZONES).map(([key, zone]) => (
                        <g key={key}>
                            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill={zone.color} stroke="#475569" strokeWidth="0.2" rx="1" opacity="0.3" filter="url(#glow-zone)" />
                            <text x={zone.x + 2} y={zone.y + 4} fill="#94a3b8" fontSize="2.5" fontWeight="bold" opacity="0.8" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>{zone.label}</text>

                            {/* Simulated RFID Gates / Sensors */}
                            <rect x={zone.x - 0.5} y={zone.y + (zone.h / 2) - 2} width={1} height={4} fill="#3b82f6" opacity="0.8" />
                        </g>
                    ))}

                    {/* MOVEMENT VECTORS (Dashed Lines) */}
                    {workers.map(worker => {
                        const target = getWorkerTarget(worker);
                        if (!target || worker.status === 'IDLE' || worker.status === 'OFFLINE') return null;
                        return (
                            <g key={`path-${worker.id}`}>
                                <line
                                    x1={worker.location.x}
                                    y1={worker.location.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={worker.role === 'FORKLIFT' ? '#f59e0b' : worker.role === 'AMR' ? '#8b5cf6' : '#3b82f6'}
                                    strokeWidth="0.2"
                                    strokeDasharray="1,1"
                                    opacity="0.4"
                                />
                                <circle cx={target.x} cy={target.y} r="0.5" fill={worker.role === 'FORKLIFT' ? '#f59e0b' : worker.role === 'AMR' ? '#8b5cf6' : '#3b82f6'} opacity="0.6" />
                            </g>
                        );
                    })}

                    {/* THE DIGITAL SHADOW (Motion History Trail) */}
                    {selectedItem?.type === 'WORKER' && selectedItem.data.pathHistory?.length > 1 && (
                        <polyline
                            points={getPathString(selectedItem.data.pathHistory)}
                            fill="none"
                            stroke={selectedItem.data.role === 'AMR' ? '#a78bfa' : '#60a5fa'}
                            strokeWidth="0.4"
                            opacity="0.8"
                            strokeLinecap="round"
                            strokeDasharray="0.5, 0.5"
                            filter="url(#glow-worker)"
                        />
                    )}

                    {/* HEATMAP LAYER */}
                    {showHeatmap && inventory.map(item => {
                        if (item.velocity === 'A') {
                            return (
                                <circle key={`heat-${item.id}`} cx={item.coordinate.x} cy={item.coordinate.y} r="6" fill="url(#heatGradient)" opacity="0.5" className="animate-pulse" />
                            );
                        }
                        return null;
                    })}

                    {/* TASKS / ASSETS */}
                    {showTasks && tasks.filter(t => t.status !== 'COMPLETED').map(task => {
                        const late = isLate(task);
                        const stalled = isStalled(task);

                        return (
                            <g
                                key={task.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'TASK', data: task }); }}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                {/* Status Halo */}
                                {stalled && <circle cx={task.coordinate.x} cy={task.coordinate.y} r="3" fill="#ef4444" opacity="0.3" className="animate-ping" />}

                                <circle cx={task.coordinate.x} cy={task.coordinate.y} r="1.5" fill={late ? '#ef4444' : stalled ? '#f59e0b' : '#3b82f6'} stroke="white" strokeWidth="0.1" filter="url(#glow-worker)" />

                                {/* Larger invisible hit area */}
                                <circle cx={task.coordinate.x} cy={task.coordinate.y} r="4" fill="transparent" />

                                {/* Label if high priority */}
                                {task.priority === 'CRITICAL' && (
                                    <text x={task.coordinate.x} y={task.coordinate.y - 2} fill="white" fontSize="1.5" textAnchor="middle" style={{ textShadow: '0 0 2px black' }}>{task.id}</text>
                                )}
                            </g>
                        );
                    })}

                    {/* WORKERS & AMRs */}
                    {workers.map(worker => (
                        <g
                            key={worker.id}
                            className="transition-all duration-150 ease-linear cursor-pointer hover:scale-110"
                            style={{ transform: `translate(${worker.location.x}px, ${worker.location.y}px)` }}
                            onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'WORKER', data: worker }); }}
                        >
                            {worker.role === 'AMR' ? (
                                // AMR Icon (Square/Robot)
                                <rect x={-2} y={-2} width={4} height={4} rx="1" fill={worker.status === 'OFFLINE' ? '#334155' : '#8b5cf6'} stroke="white" strokeWidth="0.2" filter="url(#glow-worker)" />
                            ) : (
                                // Human Icon (Circle)
                                <circle cx={0} cy={0} r="2" fill={worker.status === 'IDLE' ? '#64748b' : worker.status === 'OFFLINE' ? '#334155' : '#10b981'} stroke="white" strokeWidth="0.2" filter="url(#glow-worker)" />
                            )}

                            {/* Device Indicator Dot */}
                            {worker.device !== 'NONE' && (
                                <circle cx={1.5} cy={-1.5} r="0.8" fill="#38bdf8" stroke="black" strokeWidth="0.1" />
                            )}

                            {/* Low Battery Warning */}
                            {worker.batteryLevel < 20 && worker.status !== 'OFFLINE' && (
                                <circle cx={-1.5} cy={-1.5} r="1" fill="#ef4444" className="animate-pulse" />
                            )}

                            <text x={0} y={0.8} fill="white" fontSize="1.5" textAnchor="middle" fontWeight="bold" style={{ textShadow: '0 0 1px black' }}>{worker.avatar}</text>
                        </g>
                    ))}
                </svg>

                {/* INFO CARD SLIDE-OVER */}
                {selectedItem && (
                    <div
                        className="absolute top-2 right-2 bottom-2 w-80 bg-slate-900/95 border border-slate-700 backdrop-blur-xl shadow-2xl rounded-xl z-20 flex flex-col animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-xl">
                            <div className="flex items-center gap-2 text-white font-semibold">
                                {selectedItem.type === 'WORKER' ? (
                                    <>
                                        <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-400"><User size={16} /></div>
                                        Worker Details
                                    </>
                                ) : (
                                    <>
                                        <div className="p-1.5 bg-blue-500/10 rounded text-blue-400"><Package size={16} /></div>
                                        Work Order
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                            {selectedItem.type === 'WORKER' ? (
                                <div className="space-y-6">
                                    {/* Identity Section */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-white border-2 border-slate-600 shadow-inner">
                                            {selectedItem.data.avatar}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{selectedItem.data.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-600">{selectedItem.data.role}</span>
                                                <span className="text-xs font-mono text-slate-500">{selectedItem.data.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connected Factory Device Info */}
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-slate-400">Connected Device</div>
                                            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                                                {getDeviceIcon(selectedItem.data.device)}
                                                {selectedItem.data.device}
                                            </div>
                                        </div>

                                        {/* Telemetry Stats */}
                                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
                                            <div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1"><Battery size={10} /> Battery</div>
                                                <div className={`text-sm font-bold font-mono ${selectedItem.data.batteryLevel < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                                                    {selectedItem.data.batteryLevel}%
                                                </div>
                                                <div className="h-1 bg-slate-700 rounded-full mt-1">
                                                    <div className="h-full bg-current rounded-full" style={{ width: `${selectedItem.data.batteryLevel}%` }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1"><Wifi size={10} /> Signal</div>
                                                <div className="text-sm font-bold font-mono text-blue-400">{selectedItem.data.signalStrength}%</div>
                                                <div className="h-1 bg-slate-700 rounded-full mt-1">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedItem.data.signalStrength}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                        <div className="text-xs text-slate-400 mb-1">Status</div>
                                        <div className={`flex items-center gap-2 font-bold ${selectedItem.data.status === 'BUSY' ? 'text-amber-400' :
                                            selectedItem.data.status === 'OFFLINE' ? 'text-slate-500' : 'text-emerald-400'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${selectedItem.data.status === 'BUSY' ? 'bg-amber-400 animate-pulse' :
                                                selectedItem.data.status === 'OFFLINE' ? 'bg-slate-500' : 'bg-emerald-400'
                                                }`}></span>
                                            {selectedItem.data.status}
                                        </div>
                                    </div>

                                    <div className="p-3 border border-slate-700/50 rounded-lg bg-slate-800/20">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                            <Activity size={10} /> The Digital Shadow
                                        </div>
                                        <p className="text-xs text-slate-400 italic">
                                            "Motion history displayed on map. {selectedItem.data.pathHistory?.length || 0} track-points recorded."
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Work Order Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight mb-1">{selectedItem.data.details}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedItem.data.priority === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-900' :
                                                selectedItem.data.priority === 'HIGH' ? 'bg-amber-900/50 text-amber-400 border border-amber-900' :
                                                    'bg-blue-900/50 text-blue-400 border border-blue-900'
                                                }`}>
                                                {selectedItem.data.priority}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500">{selectedItem.data.id}</span>
                                        </div>
                                    </div>

                                    {/* Manufacturing Stage */}
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-slate-400 uppercase tracking-wider">Current Stage</div>
                                            <div className="text-blue-400 font-bold font-mono">{selectedItem.data.stage || 'PENDING'}</div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
                                            {/* Visual stage progress */}
                                            {['WELDING', 'PAINT', 'ASSEMBLY', 'QA', 'STAGING'].map((s, i) => (
                                                <div key={s} className={`flex-1 border-r border-slate-900 ${
                                                    // Rough approximation of progress based on stage enum
                                                    ['WELDING', 'PAINT', 'ASSEMBLY', 'QA', 'STAGING'].indexOf(selectedItem.data.stage || '') >= i
                                                        ? 'bg-blue-500'
                                                        : 'bg-transparent'
                                                    }`}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quality Status */}
                                    {selectedItem.data.stage === 'QA' && (
                                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex items-center gap-3">
                                            <ShieldCheck className="text-emerald-500" />
                                            <div>
                                                <div className="text-xs text-slate-400">Quality Inspection</div>
                                                <div className="text-white font-bold">{selectedItem.data.qualityCheck || 'IN PROGRESS'}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Scheduling Info */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                                            <span className="text-slate-400 flex items-center gap-2"><Calendar size={14} /> Ship Deadline</span>
                                            <span className={`font-mono font-bold ${isLate(selectedItem.data) ? 'text-red-400' : 'text-white'}`}>
                                                {new Date(selectedItem.data.shipDeadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                                            <span className="text-slate-400 flex items-center gap-2"><Clock size={14} /> Last Moved</span>
                                            <span className={`${isStalled(selectedItem.data) ? 'text-amber-400 font-bold' : 'text-slate-400'} font-mono text-xs`}>
                                                {Math.floor((Date.now() - selectedItem.data.lastMoved) / 1000)}s ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-700 bg-slate-800/30 rounded-b-xl">
                            {selectedItem.type === 'WORKER' ? (
                                <button
                                    onClick={() => onMessageWorker?.(selectedItem.data.id)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={16} />
                                    Message Device
                                </button>
                            ) : (
                                <button
                                    onClick={() => onExpediteTask?.(selectedItem.data.id)}
                                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={16} />
                                    EXPEDITE ORDER
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
