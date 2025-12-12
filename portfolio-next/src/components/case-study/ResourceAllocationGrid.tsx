"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Types ---

type ResourceStatus = "idle" | "active" | "critical" | "completed";

interface ResourceNode {
    id: string;
    name: string;
    role: string;
    capacity: number; // 0-100
    status: ResourceStatus;
}

interface AllocationGridProps {
    initialResources?: ResourceNode[];
}

// --- Mock Data ---

const MOCK_RESOURCES: ResourceNode[] = [
    { id: "r1", name: "Alpha Crew", role: "Excavation", capacity: 80, status: "active" },
    { id: "r2", name: "Beta Crew", role: "Fiber Optic", capacity: 45, status: "idle" },
    { id: "r3", name: "Gamma Crew", role: "Restoration", capacity: 95, status: "critical" },
    { id: "r4", name: "Delta Unit", role: "Inspection", capacity: 100, status: "completed" },
    { id: "r5", name: "Echo Team", role: "Drilling", capacity: 60, status: "active" },
];

/**
 * Utility for merging Tailwind classes safely.
 */
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

/**
 * ResourceAllocationGrid
 *
 * A high-performance demonstration component for visualizing and managing field resources.
 * Showcases:
 * - Complex State Management: Optimistic updates and filtering.
 * - Performance: Memoized computations and callbacks.
 * - UX: Micro-interactions with Framer Motion.
 * - A11y: Keyboard navigation support (basic).
 *
 * @param props.initialResources - Initial list of resources to display.
 */
export const ResourceAllocationGrid: React.FC<AllocationGridProps> = ({
    initialResources = MOCK_RESOURCES,
}) => {
    const [resources, setResources] = useState<ResourceNode[]>(initialResources);
    const [filter, setFilter] = useState<ResourceStatus | "all">("all");

    // --- Optimization: Memoized Filter ---
    // Memoize the filtered list to prevent re-calculation on unrelated renders.
    const filteredResources = useMemo(() => {
        if (filter === "all") return resources;
        return resources.filter((r) => r.status === filter);
    }, [resources, filter]);

    // --- Optimization: Memoized Stats ---
    // Calculate average capacity only when the resource list changes.
    const averageCapacity = useMemo(() => {
        if (resources.length === 0) return 0;
        const total = resources.reduce((acc, r) => acc + r.capacity, 0);
        return Math.round(total / resources.length);
    }, [resources]);

    // --- Actions ---
    const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

    const handleDispatchClick = useCallback((id: string) => {
        setSelectedResourceId(id);
        setDispatchModalOpen(true);
    }, []);

    const handleConfirmDispatch = useCallback((job: string) => {
        if (selectedResourceId) {
            setResources((prev) =>
                prev.map((r) =>
                    r.id === selectedResourceId ? { ...r, status: "active", role: `Assigned: ${job}` } : r
                )
            );
        }
        setDispatchModalOpen(false);
    }, [selectedResourceId]);

    /**
     * Simulates a status update with an optimistic UI update.
     */
    const handleStatusToggle = useCallback((id: string) => {
        setResources((prev) =>
            prev.map((r) => {
                if (r.id !== id) return r;
                // Cycle status for demo purposes
                const nextStatus: Record<ResourceStatus, ResourceStatus> = {
                    idle: "active",
                    active: "critical",
                    critical: "completed",
                    completed: "idle",
                };
                return { ...r, status: nextStatus[r.status] };
            })
        );
    }, []);

    const selectedResourceName = resources.find(r => r.id === selectedResourceId)?.name || "";

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm relative">
            <DispatchModal
                isOpen={dispatchModalOpen}
                onClose={() => setDispatchModalOpen(false)}
                onConfirm={handleConfirmDispatch}
                resourceName={selectedResourceName}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Resource Command</h3>
                    <p className="text-sm text-slate-400">
                        System Load: <span className={cn(
                            "font-mono font-bold",
                            averageCapacity > 90 ? "text-red-400" : "text-emerald-400"
                        )}>{averageCapacity}%</span>
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex gap-2">
                    {["all", "active", "critical"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as ResourceStatus | "all")}
                            className={cn(
                                "px-3 py-1 text-xs rounded-full border transition-all duration-200",
                                filter === f
                                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onToggle={() => handleStatusToggle(resource.id)}
                            onDispatch={() => handleDispatchClick(resource.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* --- Test Suggestions --- */}
            {/* 
        This component should be tested with React Testing Library:
        1. Render: Verify all resources are displayed initially.
        2. Filter: Click "Active" filter, assert non-active items are removed.
        3. Interaction: Click a card to toggle status, assert status text/icon changes.
        4. Performance: Use a large dataset (1000 items) and verify render times using profiler or standard performance tests.
       */}
            {/* Disclaimer Footer */}
            <div className="mt-6 border-t border-slate-800/50 pt-4">
                <p className="text-[10px] text-slate-600 font-mono text-center">
                    * DISCLAIMER: Information for demonstration only and not considered factual.
                </p>
            </div>
        </div>
    );
};

// --- Sub-components ---

// --- Modal Component ---

const DispatchModal = ({
    isOpen,
    onClose,
    onConfirm,
    resourceName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (job: string) => void;
    resourceName: string;
}) => {
    if (!isOpen) return null;

    const jobs = ["Project Alpha (Excavation)", "Sector 7 (Maintenance)", "Downtown Fiber (Repair)", "Emergency Response (Storm)"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
                <h3 className="text-xl font-bold text-white mb-2">Dispatch Order</h3>
                <p className="text-slate-400 text-sm mb-6">Assign <span className="text-white font-semibold">{resourceName}</span> to a new active ticket.</p>

                <div className="space-y-2 mb-6">
                    {jobs.map(job => (
                        <button
                            key={job}
                            onClick={() => onConfirm(job)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors text-sm font-medium border border-transparent hover:border-indigo-400"
                        >
                            {job}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Sub-components ---

interface ResourceCardProps {
    resource: ResourceNode;
    onToggle: () => void;
    onDispatch: () => void;
}

// Optimization: React.memo to prevent re-render if props haven't changed.
const ResourceCard = React.memo(({ resource, onToggle, onDispatch }: ResourceCardProps) => {
    const statusConfig = {
        idle: { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-700", icon: Clock },
        active: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/50", icon: CheckCircle },
        critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/50", icon: AlertCircle },
        completed: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/50", icon: CheckCircle },
    };

    const config = statusConfig[resource.status];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className={cn(
                "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-slate-800/40 backdrop-blur-md transition-colors gap-4",
                config.border
            )}
        >
            <div className="flex items-center gap-4 cursor-pointer" onClick={onToggle}>
                <div className={cn("p-2 rounded-lg", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {resource.name}
                    </h4>
                    <p className="text-xs text-slate-500">{resource.role}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Capacity Bar (Hidden on very small screens) */}
                <div className="hidden sm:block text-right">
                    <div className="text-xs text-slate-500 mb-1">Capacity</div>
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className={cn("h-full rounded-full", config.bg.replace("/10", ""))}
                            initial={{ width: 0 }}
                            animate={{ width: `${resource.capacity}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={cn("px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider", config.bg, config.color, config.border)}>
                        {resource.status}
                    </div>

                    {/* Dispatch Action */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDispatch();
                        }}
                        className="px-4 py-1.5 rounded-full bg-slate-700 hover:bg-white hover:text-black text-xs font-bold text-white transition-all shadow-lg active:scale-95"
                    >
                        Dispatch
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

ResourceCard.displayName = "ResourceCard";

