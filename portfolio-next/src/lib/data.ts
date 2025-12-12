import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

// Keeping the interface compatible but enhancing content
export interface Project {
    slug: string;
    title: string;
    subtitle: string;
    coverImage: string;
    overview: string;
    challenge: string;
    techStack: string[];
    technicalDeepDive: string;
    impact: {
        label: string;
        value: string;
        description: string;
    }[];
    role: string[];
}

// Static fallback data for when Firestore isn't available or for build time
export const PROJECTS_DATA: Project[] = [
    {
        slug: "midwest-underground-ops",
        title: "Midwest Underground",
        subtitle: "Precision Beneath: Next-Gen Utility Infrastructure",
        coverImage: "/images/midwest-ops.jpg",
        overview:
            "A mission-critical Operations Command Center for the 'Iron Fleet'. This platform digitizes the entire lifecycle of directional boring and utility infrastructure—from the 'Vermeer Navigator' drilling units in the field to the project management offices in Willmar, MN. It unifies hydro-excavation dispatching, fiber optic backbone installation tracking, and OSHA compliance into a single 'Project Orbit' dashboard.",
        challenge:
            "Scaling complex subterranean operations across West Central Minnesota (Hwy 23 Expansion, Spicer Water Main) required more than spreadsheets. The 'Iron Fleet' needed to synchronize high-torque boring units with restoration crews in real-time. The challenge was to replace 'phone tag' dispatching with a digital ecosystem that could handle the rugged reality of the heavy civil sector while ensuring 2026 SQUTI certification readiness.",
        techStack: ["React", "TypeScript", "Firebase", "Mapbox GL", "PWA", "Tailwind CSS"],
        technicalDeepDive:
            "The architecture mirrors the physical precision of directional boring. We implemented an offline-first PWA ('Field App') that allows crews to log utility locates and bore paths even in rural dead-zones (Renville Wind Farm). Data syncs via a 'Sync Engine' to Firestore once connectivity is restored. The 'Command Center' uses cloud functions to process GPS telemetry from the fleet, overlaying it on an interactive 'Project Orbit' map. This ensures strict adherence to safety protocols (Safe Daylighting) and provides a granular view of every cubic yard moved.",
        impact: [
            {
                label: "Fleet Uptime",
                value: "99.9%",
                description: "Digital dispatching for Vermeer units.",
            },
            {
                label: "Safety Compliance",
                value: "100%",
                description: "OSHA & SQUTI certification tracking.",
            },
            {
                label: "Projects Types",
                value: "4+",
                description: "Boring, Hydro-Vac, Fiber, Wind.",
            },
        ],
        role: ["Lead Full Stack Engineer", "Product Owner"],
    },
    {
        slug: "manufacturing-control-framework",
        title: "DDW Quality Control",
        subtitle: "Zero-Defect Manufacturing at Scale",
        coverImage: "/images/manufacturing.jpg",
        overview:
            "A high-velocity Quality Control dashboard designed for precision manufacturing environments. This system aggregates telemetry from CNC machines and manual inspection stations to identify variance anomalies in real-time, preventing scrap before it leaves the production line.",
        challenge:
            "High-precision manufacturing leaves zero margin for error. The client struggled with localized quality data—defects detected at Station A weren't communicated to Station B until the end of the shift. They needed a 'nervous system' for the factory floor that could ingest high-frequency data and visualize control charts (SPC) instantly.",
        techStack: ["Next.js", "Python (FastAPI)", "PostgreSQL", "D3.js", "WebSocket", "Docker"],
        technicalDeepDive:
            "Built a hybrid architecture: a Python FastAPI ingestion layer handles high-throughput telemetry from machine PLCs, writing to a time-series optimized PostgreSQL instance. The frontend, powered by Next.js and D3.js, subscribes to WebSocket streams to render live X-bar and R control charts. An anomaly detection algorithm runs in parallel, triggering visual alerts on the shop floor dashboard if process capability (Cpk) dips below 1.33. This direct feedback loop empowers operators to adjust tooling parameters immediately.",
        impact: [
            {
                label: "Scrap Reduction",
                value: "14%",
                description: "Decrease in material waste in Q1 post-launch.",
            },
            {
                label: "Detection Time",
                value: "<1s",
                description: "Real-time alerting for out-of-spec variances.",
            },
            {
                label: "ROI",
                value: "6mo",
                description: "System paid for itself in material savings.",
            },
        ],
        role: ["Database Architect", "Frontend Lead"],
    },
    {
        slug: "global-market-research",
        title: "Global Market Research",
        subtitle: "Signal from Noise: Financial Data Aggregation",
        coverImage: "/images/project-update.jpg",
        overview:
            "An advanced data aggregation platform for tracking global financial indices and market sentiment. By fusing quantitative market feeds with qualitative news sentiment analysis, this dashboard provides analysts with a holographic view of market health.",
        challenge:
            "Financial analysts were overwhelmed by disparate data streams—Bloomberg terminals, RSS feeds, and internal CSV reports. Synthesizing this into a coherent daily strategy took hours. The goal was to build a 'single pane of glass' that automated the data cleaning and presented actionable intelligence.",
        techStack: ["React", "Node.js", "GraphQL", "Redis", "Elasticsearch", "Recharts"],
        technicalDeepDive:
            "The core innovation is a federated GraphQL API that acts as a gateway for multiple data sources. We utilized Redis for aggressive caching of stock tickers to minimize API latency and costs. For news analysis, an Elasticsearch cluster indexes thousands of daily articles, enabling instant keyword sentiment scoring. The frontend uses highly optimized Recharts components to render heavy datasets (50k+ points) without UI blocking, utilizing Web Workers for data parsing.",
        impact: [
            {
                label: "Data Points",
                value: "50M+",
                description: "Analyzed daily across global markets.",
            },
            {
                label: "Analysis Time",
                value: "-2hrs",
                description: "Saved per analyst per day in reporting.",
            },
            {
                label: "Uptime",
                value: "99.99%",
                description: "High-availability architecture for trading hours.",
            },
        ],
        role: ["Data Systems Engineer", "UI/UX Designer"],
    },
];

export async function getAllProjects(): Promise<Project[]> {
    try {
        // Attempt fetch from Firestore
        const q = query(collection(db, "projects"), orderBy("title")); // Simple order
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    slug: doc.id,
                    ...data,
                    techStack: data.techStack || [],
                    impact: data.impact || [],
                    role: data.role || []
                } as Project;
            });
        }

        // Fallback to static data if DB is empty or fails
        return PROJECTS_DATA;

    } catch (error) {
        console.warn("Firestore fetch failed, using fallback data:", error);
        return PROJECTS_DATA;
    }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    try {
        const docRef = doc(db, "projects", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                slug: docSnap.id,
                ...data,
                techStack: data.techStack || [],
                impact: data.impact || [],
                role: data.role || []
            } as Project;
        } else {
            // Fallback lookup
            const project = PROJECTS_DATA.find(p => p.slug === slug);
            return project || null;
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        // Fallback lookup
        const project = PROJECTS_DATA.find(p => p.slug === slug);
        return project || null;
    }
}

export interface Service {
    id: string; // doc id
    title: string;
    description: string;
    icon?: string; // Lucide icon name or similar identifier
    impact?: string;
    colSpan?: number;
}

export const DEFAULT_SERVICES: Service[] = [
    {
        id: "workflow-automation",
        title: "Workflow Automation",
        description: "Replacing human data entry with deterministic logic.",
        icon: "Workflow",
        impact: "100% Error Reduction",
        colSpan: 2
    },
    {
        id: "margin-improvement",
        title: "Margin Improvement",
        description: "Algorithmic resource allocation and waste detection.",
        icon: "TrendingUp",
        impact: "+15% Net Margin",
        colSpan: 1
    },
    {
        id: "legacy-modernization",
        title: "Legacy Modernization",
        description: "Transforming rigid monoliths into fluid micro-architectures.",
        icon: "Database",
        impact: "4x Velocity Increase",
        colSpan: 1
    },
    {
        id: "autonomous-agents",
        title: "Autonomous Agents",
        description: "Multi-agent systems that negotiate and execute complex tasks.",
        icon: "Bot",
        impact: "24/7 Operation",
        colSpan: 2
    }
];

export async function getAllServices(): Promise<Service[]> {
    try {
        const q = query(collection(db, "services"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Service));
        }
        return DEFAULT_SERVICES;
    } catch (error) {
        console.warn("Firestore fetch failed (services), using fallback:", error);
        return DEFAULT_SERVICES;
    }
}
