"use client";

import React, { useState, useEffect, useRef } from 'react';
import { WarehouseMap } from './WarehouseMap';
import { Play, RotateCcw, AlertTriangle, Activity, Terminal, TrendingUp } from 'lucide-react';
import { INITIAL_TASKS, MOCK_WORKERS, MOCK_INVENTORY, MOCK_BOTTLENECKS, ZONES } from './constants';
import { Task, Worker, TaskType, Priority, SKU, BottleneckAlert, UPHData } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Initial Chart Data
const INITIAL_CHART_DATA: UPHData[] = [
    { name: '09:00', uph: 120, target: 140 },
    { name: '10:00', uph: 132, target: 140 },
    { name: '11:00', uph: 101, target: 140 },
    { name: '12:00', uph: 134, target: 140 },
    { name: '13:00', uph: 145, target: 140 },
    { name: '14:00', uph: 142, target: 140 },
    { name: '15:00', uph: 138, target: 140 },
];

const ONE_DAY = 24 * 60 * 60 * 1000;

interface LogEntry {
    id: string;
    timestamp: Date;
    message: string;
    type: 'INFO' | 'WARN' | 'SUCCESS';
}

export const FloorFlowDashboard: React.FC = () => {
    // GLOBAL STATE (The Brain)
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
    const [inventory] = useState<SKU[]>(MOCK_INVENTORY);
    const [bottlenecks, setBottlenecks] = useState<BottleneckAlert[]>(MOCK_BOTTLENECKS);
    const [chartData, setChartData] = useState<UPHData[]>(INITIAL_CHART_DATA);
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 'init', timestamp: new Date(), message: 'System initialized. WMS/MES Bridge Active.', type: 'INFO' }
    ]);
    const [isDemoRunning, setIsDemoRunning] = useState(false);

    // Refs for Simulation Loop access
    const tasksRef = useRef(tasks);
    const workersRef = useRef(workers);
    const chartRef = useRef(chartData);

    // Sync Refs
    useEffect(() => { tasksRef.current = tasks; }, [tasks]);
    useEffect(() => { workersRef.current = workers; }, [workers]);
    useEffect(() => { chartRef.current = chartData; }, [chartData]);

    const addLog = (message: string, type: 'INFO' | 'WARN' | 'SUCCESS' = 'INFO') => {
        setLogs(prev => [{ id: Math.random().toString(36), timestamp: new Date(), message, type }, ...prev].slice(0, 50));
    };

    // Helper: Check if point in box
    const isInZone = (x: number, y: number, zone: { x: number, y: number, w: number, h: number }) => {
        return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
    };

    // --- SIMULATION GAME LOOP ---
    useEffect(() => {
        if (!isDemoRunning) return;

        let tickCount = 0;

        const gameLoop = setInterval(() => {
            tickCount++;
            const currentTasks = [...tasksRef.current];
            const currentWorkers = [...workersRef.current];
            let hasUpdates = false;

            // 1. PHYSICS & TASK EXECUTION
            const updatedWorkers = currentWorkers.map(worker => {
                let nextWorker = { ...worker };

                // Telemetry
                if (tickCount % 50 === 0 && nextWorker.batteryLevel > 0) nextWorker.batteryLevel -= 1;
                if (Math.random() > 0.98) nextWorker.signalStrength = Math.floor(Math.random() * 40) + 60;

                // Path History
                const newHistory = [...(nextWorker.pathHistory || []), nextWorker.location];
                if (newHistory.length > 40) newHistory.shift();
                nextWorker.pathHistory = newHistory;

                // Find active task
                const activeTask = currentTasks.find(t =>
                    t.assignedTo === nextWorker.id &&
                    (t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS')
                );

                if (!activeTask) {
                    // IDLE BEHAVIOR
                    if (nextWorker.role === 'AMR') return nextWorker;
                    if (Math.random() > 0.98) {
                        return {
                            ...nextWorker,
                            location: {
                                x: Math.max(0, Math.min(100, nextWorker.location.x + (Math.random() - 0.5) * 2)),
                                y: Math.max(0, Math.min(80, nextWorker.location.y + (Math.random() - 0.5) * 2))
                            }
                        };
                    }
                    return { ...nextWorker, status: 'IDLE' as const };
                }

                // TARGET LOGIC
                let target = activeTask.coordinate;
                if (activeTask.type === TaskType.MANUFACTURING) {
                    if (activeTask.stage === 'WELDING') target = { x: ZONES.PAINT.x + 5, y: ZONES.PAINT.y + 20 };
                    else if (activeTask.stage === 'PAINT') target = { x: ZONES.ASSEMBLY.x + 5, y: ZONES.ASSEMBLY.y + 20 };
                    else if (activeTask.stage === 'ASSEMBLY') target = { x: ZONES.QA.x + 15, y: ZONES.QA.y + 10 };
                    else if (activeTask.stage === 'QA') {
                        if (activeTask.qualityCheck === 'FAIL') target = { x: ZONES.REWORK.x + 10, y: ZONES.REWORK.y + 10 };
                        else target = { x: ZONES.STAGING.x + 20, y: ZONES.STAGING.y + 10 };
                    }
                    else if (activeTask.stage === 'REWORK') target = { x: ZONES.QA.x + 5, y: ZONES.QA.y + 10 };

                    activeTask.coordinate = nextWorker.location;
                    activeTask.lastMoved = Date.now();
                    hasUpdates = true;
                }

                const dx = target.x - nextWorker.location.x;
                const dy = target.y - nextWorker.location.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let baseSpeed = 0.6;
                if (nextWorker.role === 'FORKLIFT') baseSpeed = 1.8;
                if (nextWorker.role === 'AMR') baseSpeed = 2.5;
                const SPEED = baseSpeed * nextWorker.efficiency;

                if (dist < SPEED) {
                    // ARRIVED
                    if (activeTask.type === TaskType.MANUFACTURING) {
                        if (activeTask.stage === 'WELDING' && isInZone(nextWorker.location.x, nextWorker.location.y, ZONES.PAINT)) {
                            activeTask.stage = 'PAINT';
                            activeTask.details = activeTask.details.replace('Welding', 'Paint Prep');
                            addLog(`Hull ${activeTask.id} moved to PAINT`, 'INFO');
                            hasUpdates = true;
                        } else if (activeTask.stage === 'PAINT' && isInZone(nextWorker.location.x, nextWorker.location.y, ZONES.ASSEMBLY)) {
                            activeTask.stage = 'ASSEMBLY';
                            activeTask.details = activeTask.details.replace('Paint Prep', 'Final Rigging');
                            addLog(`Hull ${activeTask.id} moved to ASSEMBLY`, 'INFO');
                            hasUpdates = true;
                        } else if (activeTask.stage === 'ASSEMBLY' && isInZone(nextWorker.location.x, nextWorker.location.y, ZONES.QA)) {
                            activeTask.stage = 'QA';
                            activeTask.details = 'QA Inspection';
                            activeTask.qualityCheck = Math.random() > 0.1 ? 'PASS' : 'FAIL';
                            addLog(`Hull ${activeTask.id} entering QA`, 'INFO');
                            hasUpdates = true;
                        } else if (activeTask.stage === 'QA') {
                            if (activeTask.qualityCheck === 'FAIL') {
                                activeTask.stage = 'REWORK';
                                activeTask.details = 'Quality Fail: Rework';
                                activeTask.status = 'PENDING';
                                addLog(`QA ALERT: Hull ${activeTask.id} FAILED inspection`, 'WARN');
                            } else {
                                activeTask.stage = 'STAGING';
                                activeTask.status = 'COMPLETED';
                                addLog(`Hull ${activeTask.id} PASSED QA - Ready to Ship`, 'SUCCESS');
                            }
                            hasUpdates = true;
                        }
                    } else {
                        if (activeTask.status === 'ASSIGNED') {
                            activeTask.status = 'IN_PROGRESS';
                            hasUpdates = true;
                        } else if (activeTask.status === 'IN_PROGRESS' && Math.random() > 0.95) {
                            activeTask.status = 'COMPLETED';
                            addLog(`Task ${activeTask.id} Completed`, 'SUCCESS');
                            hasUpdates = true;
                            return { ...nextWorker, status: 'IDLE' as const };
                        }
                    }
                    return { ...nextWorker, location: target, status: 'BUSY' as const };
                } else {
                    const ratio = SPEED / dist;
                    return {
                        ...nextWorker,
                        status: 'BUSY' as const,
                        location: {
                            x: nextWorker.location.x + dx * ratio,
                            y: nextWorker.location.y + dy * ratio
                        }
                    };
                }
            });

            // 2. CHART UPDATES (Simulate Live Data)
            if (tickCount % 20 === 0) {
                const lastPoint = chartRef.current[chartRef.current.length - 1];
                const variance = Math.floor((Math.random() - 0.5) * 10);
                const newUPH = Math.max(90, Math.min(160, lastPoint.uph + variance));
                const now = new Date();
                const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

                setChartData(prev => [...prev.slice(1), { name: timeLabel, uph: newUPH, target: 140 }]);
            }

            if (tickCount % 50 === 0 && Math.random() > 0.4) {
                // New Order logic
                const newTask: Task = {
                    id: `WO-${Math.floor(Math.random() * 9000) + 1000}`,
                    type: TaskType.MANUFACTURING,
                    status: 'PENDING',
                    priority: Priority.NORMAL,
                    targetTimeSeconds: 300,
                    details: `Hull #G3-${Math.floor(Math.random() * 1000)} - Welding`,
                    locationLabel: 'Welding Bay 2',
                    coordinate: { x: 10, y: 10 },
                    stage: 'WELDING',
                    timestamp: Date.now(),
                    shipDeadline: Date.now() + (ONE_DAY * 1),
                    lastMoved: Date.now(),
                    qualityCheck: 'PENDING'
                };
                currentTasks.push(newTask);
                addLog(`New Order Received: ${newTask.id}`, 'INFO');
                hasUpdates = true;
            }

            if (hasUpdates) setTasks(currentTasks);
            setWorkers(updatedWorkers);

        }, 100);

        return () => clearInterval(gameLoop);
    }, [isDemoRunning]);

    // Actions
    const handleExpediteTask = (taskId: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: Priority.CRITICAL } : t));
        addLog(`Task ${taskId} flagged as CRITICAL`, 'WARN');
    };

    const handleMessageWorker = (workerId: string) => {
        addLog(`Message sent to ${workerId}`, 'INFO');
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[800px] text-slate-200 p-2 md:p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl">

            {/* LEFT: MAP */}
            <div className="flex-1 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsDemoRunning(!isDemoRunning)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${isDemoRunning ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                        >
                            {isDemoRunning ? <RotateCcw size={14} /> : <Play size={14} />}
                            {isDemoRunning ? 'LIVE SIMULATION' : 'START DEMO'}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</div>
                    </div>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-900/50">
                    <WarehouseMap
                        tasks={tasks}
                        workers={workers}
                        inventory={inventory}
                        onExpediteTask={handleExpediteTask}
                        onMessageWorker={handleMessageWorker}
                    />
                </div>
            </div>

            {/* RIGHT: STATS SIDEBAR */}
            <div className="w-full md:w-80 flex flex-col gap-4">

                {/* KPI Card (UPH Chart) */}
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-lg">
                    <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp size={14} className="text-blue-500" /> Units Per Hour (Real-Time)
                    </h3>
                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUph" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide domain={[80, 180]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="uph" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUph)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1">
                        <div className="text-2xl font-bold text-white tracking-tight">{chartData[chartData.length - 1].uph} <span className="text-sm font-normal text-slate-500">UPH</span></div>
                        <div className="text-xs text-emerald-400 font-mono">TARGET: 140</div>
                    </div>
                </div>

                {/* System Logs (Terminal Style) */}
                <div className="flex-1 bg-black/40 border border-slate-800 p-4 rounded-xl overflow-hidden flex flex-col min-h-[200px] shadow-inner font-mono">
                    <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800/50 pb-2">
                        <Terminal size={14} /> System Events
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                        {logs.map(log => (
                            <div key={log.id} className="text-[10px] leading-tight flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-slate-600 shrink-0">[{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                <span className={`${log.type === 'WARN' ? 'text-amber-400' : log.type === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        {logs.length === 0 && <div className="text-slate-700 italic text-[10px]">System idle...</div>}
                    </div>
                </div>

                {/* Bottlenecks Container */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                        <AlertTriangle size={14} className="text-red-500" /> Active Alerts
                    </h3>
                    <div className="space-y-2">
                        {bottlenecks.map(b => (
                            <div key={b.id} className="p-2 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-red-400 group-hover:text-red-300">{b.area}</span>
                                    <span className="text-[10px] text-slate-500 border border-slate-700 rounded px-1">{b.severity}</span>
                                </div>
                                <p className="text-[10px] text-slate-400">{b.cause}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
