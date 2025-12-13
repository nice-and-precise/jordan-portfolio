import { Insight, SKU, Task, TaskType, Priority, BottleneckAlert, GoldenCycleStep, Worker } from './types';

// --- FACTORY ZONES (G3 "Google Maps" Layer) ---
export const ZONES = {
    WELDING: { x: 5, y: 5, w: 25, h: 40, label: 'Welding & Fab', color: '#475569' },
    PAINT: { x: 35, y: 5, w: 25, h: 40, label: 'Paint Shop', color: '#334155' },
    ASSEMBLY: { x: 65, y: 5, w: 30, h: 40, label: 'Assembly Line', color: '#1e293b' },
    QA: { x: 65, y: 50, w: 30, h: 20, label: 'Quality Control', color: '#0f172a' },
    REWORK: { x: 35, y: 50, w: 25, h: 20, label: 'Rework Station', color: '#451a03' }, // New Rework Zone
    STAGING: { x: 5, y: 50, w: 25, h: 20, label: 'Outbound Staging', color: '#064e3b' },
};

// --- MOCK WORKERS (Augmented Workforce + AMRs) ---
export const MOCK_WORKERS: Worker[] = [
    { id: 'W-01', name: 'Maria G.', role: 'PICKER', status: 'BUSY', location: { x: 15, y: 20 }, avatar: 'MG', device: 'WEARABLE', efficiency: 0.95, batteryLevel: 88, signalStrength: 95, pathHistory: [] },
    { id: 'W-02', name: 'Davon L.', role: 'FORKLIFT', status: 'BUSY', location: { x: 75, y: 40 }, avatar: 'DL', device: 'TABLET', efficiency: 0.88, batteryLevel: 62, signalStrength: 80, pathHistory: [] },
    { id: 'W-03', name: 'Sarah K.', role: 'ASSEMBLER', status: 'BUSY', location: { x: 70, y: 15 }, avatar: 'SK', device: 'TABLET', efficiency: 0.92, batteryLevel: 45, signalStrength: 90, pathHistory: [] },
    { id: 'W-04', name: 'James T.', role: 'WELDER', status: 'IDLE', location: { x: 15, y: 25 }, avatar: 'JT', device: 'WEARABLE', efficiency: 0.85, batteryLevel: 92, signalStrength: 60, pathHistory: [] },
    { id: 'W-05', name: 'Elena R.', role: 'PAINTER', status: 'IDLE', location: { x: 45, y: 25 }, avatar: 'ER', device: 'HANDHELD', efficiency: 0.90, batteryLevel: 15, signalStrength: 85, pathHistory: [] },
    // PDF: "Augmented Workforce" - QA Tech with Tablet
    { id: 'W-06', name: 'Marcus B.', role: 'QA_SPECIALIST', status: 'IDLE', location: { x: 70, y: 55 }, avatar: 'MB', device: 'TABLET', efficiency: 0.98, batteryLevel: 78, signalStrength: 99, pathHistory: [] },
    // PDF: "Robotics/AMR" - Autonomous Mobile Robot
    { id: 'R-01', name: 'AMR-01', role: 'AMR', status: 'IDLE', location: { x: 80, y: 60 }, avatar: '🤖', device: 'NONE', efficiency: 1.0, batteryLevel: 100, signalStrength: 100, pathHistory: [] },
    { id: 'R-02', name: 'AMR-02', role: 'AMR', status: 'BUSY', location: { x: 20, y: 60 }, avatar: '🤖', device: 'NONE', efficiency: 1.0, batteryLevel: 30, signalStrength: 100, pathHistory: [] },
];

// --- MOCK INVENTORY ---
export const MOCK_INVENTORY: SKU[] = [
    // Raw Materials
    { id: 'ALUM-SHEET', name: 'Aluminum Sheet 5x10', location: 'Raw-A01', coordinate: { x: 8, y: 10 }, velocity: 'A', stock: 450 },
    { id: 'RIVET-PK', name: 'Marine Rivets (1k)', location: 'Raw-A02', coordinate: { x: 8, y: 15 }, velocity: 'A', stock: 1200 },
    { id: 'PAINT-WHT', name: 'Marine Coat - White', location: 'Paint-Sto', coordinate: { x: 40, y: 10 }, velocity: 'B', stock: 50 },
    { id: 'SEAT-CAPT', name: 'Captain Chair v2', location: 'Assem-B01', coordinate: { x: 70, y: 10 }, velocity: 'A', stock: 35 },
    { id: 'CONSOLE-X', name: 'Helm Console Unit', location: 'Assem-B02', coordinate: { x: 70, y: 15 }, velocity: 'B', stock: 20 },
];

const ONE_DAY = 24 * 60 * 60 * 1000;

// --- INITIAL TASKS (WORK ORDERS) ---
export const INITIAL_TASKS: Task[] = [
    // Active Manufacturing Tasks
    {
        id: 'WO-101',
        type: TaskType.MANUFACTURING,
        status: 'IN_PROGRESS',
        assignedTo: 'W-04',
        priority: Priority.CRITICAL,
        targetTimeSeconds: 300,
        details: 'Hull #G3-8821 - Welding',
        locationLabel: 'Welding Bay 1',
        coordinate: { x: 15, y: 15 }, // In Welding Zone
        stage: 'WELDING',
        timestamp: Date.now() - 45000,
        shipDeadline: Date.now() + ONE_DAY * 2, // Due in 2 days
        lastMoved: Date.now(),
        qualityCheck: 'PENDING'
    },
    {
        id: 'WO-102',
        type: TaskType.MANUFACTURING,
        status: 'IN_PROGRESS',
        assignedTo: 'W-05',
        priority: Priority.HIGH,
        targetTimeSeconds: 400,
        details: 'Hull #G3-8819 - Primer Coat',
        locationLabel: 'Paint Booth A',
        coordinate: { x: 45, y: 20 }, // In Paint Zone
        stage: 'PAINT',
        timestamp: Date.now() - 120000,
        shipDeadline: Date.now() + ONE_DAY * 1, // Due Tomorrow
        lastMoved: Date.now() - 100000, // Moving slow
        qualityCheck: 'PENDING'
    },
    {
        id: 'WO-103',
        type: TaskType.MANUFACTURING,
        status: 'IN_PROGRESS',
        assignedTo: 'W-03',
        priority: Priority.NORMAL,
        targetTimeSeconds: 600,
        details: 'Hull #G3-8815 - Final Rigging',
        locationLabel: 'Assembly Line 2',
        coordinate: { x: 75, y: 20 }, // In Assembly Zone
        stage: 'ASSEMBLY',
        timestamp: Date.now() - 300000,
        shipDeadline: Date.now() + ONE_DAY * 0.5, // Due Today
        lastMoved: Date.now(),
        qualityCheck: 'PENDING'
    },
    // Pending Queue (Backlog)
    {
        id: 'WO-104',
        type: TaskType.PICKING,
        status: 'PENDING',
        priority: Priority.HIGH,
        targetTimeSeconds: 90,
        details: 'Kit Pull: Console Electronics',
        locationLabel: 'Assem-B02',
        coordinate: { x: 70, y: 15 },
        timestamp: Date.now() - 300000,
        shipDeadline: Date.now() + ONE_DAY * 1,
        lastMoved: Date.now(),
        qualityCheck: 'PENDING'
    },
    {
        id: 'WO-105',
        type: TaskType.PUTAWAY,
        status: 'PENDING',
        priority: Priority.NORMAL,
        targetTimeSeconds: 240,
        details: 'Restock: Seat Cushions',
        locationLabel: 'Assem-B01',
        coordinate: { x: 70, y: 10 },
        timestamp: Date.now() - 60000,
        shipDeadline: Date.now() + ONE_DAY * 3,
        lastMoved: Date.now(),
        qualityCheck: 'PENDING'
    },
    {
        id: 'WO-106',
        type: TaskType.SHIPPING,
        status: 'PENDING',
        priority: Priority.CRITICAL,
        targetTimeSeconds: 600,
        details: 'Load Dealer Order: Texas Marine',
        locationLabel: 'Staging Bay 1',
        coordinate: { x: 10, y: 60 },
        timestamp: Date.now() - 10000,
        shipDeadline: Date.now() + ONE_DAY * 0.2, // Due very soon
        lastMoved: Date.now(),
        qualityCheck: 'PASS'
    }
];

export const MOCK_INSIGHTS: Insight[] = [
    {
        id: '1',
        title: 'Paint Shop Bottleneck',
        description: 'Hulls accumulating in Paint. Throughput drops 12% when humidity > 60%.',
        impact: '-2 Boats/Day',
        type: 'BOTTLENECK'
    },
    {
        id: '2',
        title: 'Quality Rework Spikes',
        description: 'First Pass Yield dropped to 82% on Assembly Line 2. Check Torque Calibration.',
        impact: 'Quality Risk',
        type: 'ANOMALY'
    },
    {
        id: '3',
        title: 'AMR Path Optimization',
        description: 'Reroute AMR-02 to avoid Welding Zone congestion during shift change.',
        impact: '+4% Logistics UPH',
        type: 'OPTIMIZATION'
    }
];

export const MOCK_BOTTLENECKS: BottleneckAlert[] = [
    {
        id: 'b1',
        area: 'Paint Shop',
        severity: 'WARNING',
        predictedOverflowTime: '30 mins',
        cause: 'Drying Oven Cycle Time',
        timestamp: Date.now()
    },
    {
        id: 'b2',
        area: 'Shipping Dock',
        severity: 'CRITICAL',
        predictedOverflowTime: '12 mins',
        cause: 'Trailer Scheduling Mismatch',
        timestamp: Date.now()
    }
];

export const PICKING_GOLDEN_CYCLE: GoldenCycleStep[] = [
    {
        id: 'step1',
        label: 'Travel',
        targetTimeSeconds: 20,
        instruction: 'Travel to Location'
    },
    {
        id: 'step2',
        label: 'Scan Bin',
        targetTimeSeconds: 5,
        instruction: 'Scan Bin Barcode'
    },
    {
        id: 'step3',
        label: 'Pick',
        targetTimeSeconds: 10,
        instruction: 'Pick & Verify Item'
    },
    {
        id: 'step4',
        label: 'Confirm',
        targetTimeSeconds: 5,
        instruction: 'Scan Item to Confirm'
    },
];
