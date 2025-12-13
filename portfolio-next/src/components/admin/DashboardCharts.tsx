"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Project } from '@/lib/data';

interface DashboardChartsProps {
    projects: Project[];
    leads: any[];
}

export default function DashboardCharts({ projects, leads }: DashboardChartsProps) {
    // 1. Process Data for "Pipeline Value Over Time" (Mocked based on leads timestamps relative to now)
    // Note: In a real app we'd group by `timestamp.toDate().getMonth()`
    const pipelineData = React.useMemo(() => {
        // Mocking last 6 months for visual demo if leads are empty or don't have proper timestamps
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(m => ({
            name: m,
            value: Math.floor(Math.random() * 500000) + 100000, // Random mock data for visual effect
            leads: Math.floor(Math.random() * 10)
        }));
    }, [leads]);

    // 2. Process Data for "Project Tech Stack Distribution"
    const techStackData = React.useMemo(() => {
        const counts: Record<string, number> = {};
        projects.forEach(p => {
            p.techStack.forEach(t => {
                counts[t] = (counts[t] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 5) // Top 5
            .map(([name, count]) => ({ name, count }));
    }, [projects]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="font-bold text-slate-200">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} className="text-sm" style={{ color: p.color }}>
                            {p.name}: {p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pipeline Velocity Chart */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                    <div className="w-20 h-20 bg-blue-500/20 blur-3xl rounded-full" />
                </div>

                <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Pipeline Velocity
                </h3>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pipelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '5 5' }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tech Stack Dominance Chart */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                    <div className="w-20 h-20 bg-emerald-500/20 blur-3xl rounded-full" />
                </div>

                <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Tech Stack Dominance
                </h3>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={techStackData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#94a3b8"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#10b981"
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
