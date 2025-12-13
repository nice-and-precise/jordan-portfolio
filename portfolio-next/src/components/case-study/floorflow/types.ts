export enum TaskType {
    RECEIVING = 'RECEIVING',
    PUTAWAY = 'PUTAWAY',
    PICKING = 'PICKING',
    PACKING = 'PACKING',
    SHIPPING = 'SHIPPING',
    MANUFACTURING = 'MANUFACTURING',
    QA_INSPECTION = 'QA_INSPECTION'
}

export enum Priority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    NORMAL = 'NORMAL',
    LOW = 'LOW'
}

export type ManufacturingStage = 'WELDING' | 'PAINT' | 'ASSEMBLY' | 'QA' | 'REWORK' | 'STAGING';

export type DeviceType = 'TABLET' | 'WEARABLE' | 'HANDHELD' | 'FIXED_SENSOR' | 'NONE';

export interface Coordinate {
    x: number;
    y: number;
}

export interface Worker {
    id: string;
    name: string;
    role: 'PICKER' | 'FORKLIFT' | 'SUPERVISOR' | 'WELDER' | 'PAINTER' | 'ASSEMBLER' | 'QA_SPECIALIST' | 'AMR';
    status: 'IDLE' | 'BUSY' | 'OFFLINE' | 'CHARGING';
    location: Coordinate;
    avatar: string;
    device: DeviceType; // From PDF: Augmented Workforce
    efficiency: number; // 0.0 to 1.0
    // Telemetry
    batteryLevel: number; // 0-100
    signalStrength: number; // 0-100 (WiFi/5G)
    pathHistory: Coordinate[]; // The "Digital Shadow" trail
}

export interface SKU {
    id: string;
    name: string;
    location: string;
    coordinate: Coordinate; // For map placement
    velocity: 'A' | 'B' | 'C'; // A = Fast mover (Hot), C = Slow mover
    stock: number;
}

export interface Task {
    id: string;
    type: TaskType;
    status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED_QA';
    assignedTo?: string; // Worker ID
    priority: Priority;
    targetTimeSeconds: number; // SMV (Standard Minute Value)
    actualTimeSeconds?: number;
    details: string;
    locationLabel: string;
    coordinate: Coordinate; // Where the task happens
    timestamp: number;

    // G3 Boats / Manufacturing Specific
    stage?: ManufacturingStage;
    shipDeadline: number; // Timestamp for Due Date
    lastMoved: number; // For stall detection
    qualityCheck?: 'PASS' | 'FAIL' | 'PENDING';
}

export interface Metric {
    label: string;
    value: string | number;
    trend: 'UP' | 'DOWN' | 'FLAT';
    delta: string;
    status: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export interface Insight {
    id: string;
    title: string;
    description: string;
    impact: string;
    type: 'BOTTLENECK' | 'OPTIMIZATION' | 'ANOMALY';
}

export interface BottleneckAlert {
    id: string;
    area: string;
    severity: 'CRITICAL' | 'WARNING';
    predictedOverflowTime: string;
    cause: string;
    timestamp: number;
}

export interface GoldenCycleStep {
    id: string;
    label: string;
    targetTimeSeconds: number;
    instruction: string;
}

export interface UPHData {
    name: string;
    uph: number;
    target: number;
}

export interface PerformanceObservation {
    id: string;
    metric: 'SCAN_TO_SCAN' | 'SCREEN_DWELL' | 'TASK_CYCLE_TIME';
    value: number; // milliseconds
    timestamp: number;
    context: {
        workerId?: string;
        taskId?: string;
        target?: string;
        screen?: string;
        [key: string]: any;
    };
}
