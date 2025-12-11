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
        subtitle: "The Digital Transformation of Utility Coordination",
        coverImage: "/images/midwest-ops.jpg",
        overview:
            "A mission-critical Operations Management System (OMS) built to digitize the fragmented workflow of underground utility contracting. By unifying field data entry, dispatching, and asset tracking into a single real-time platform, we eliminated paper redundancy and enabled data-driven decision making for a fleet of 50+ crews.",
        challenge:
            "Midwest Underground was scaling rapidly, but their operations were bottlenecked by manual reporting. Daily Logs were paper-based, leading to a 48-hour lag in billing data. Dispatching was done via phone tag, causing fleet inefficiencies. They needed a system that could function in remote areas (offline-first) yet sync instantly with headquarters for real-time job costing.",
        techStack: ["React", "TypeScript", "Firebase Firestore", "Google Maps Platform", "PWA", "Tailwind CSS"],
        technicalDeepDive:
            "Engineered as a Progressive Web App (PWA) to guarantee 100% uptime for field crews tracking utility locates in rural dead-zones. Leveraging Firebase Firestore's offline persistence, the app queues writes and syncs automatically upon reconnection. A custom geospatial module integrates with 811 ticket data to visualize dig sites on an interactive map, overlaying crew locations in real-time. The backend utilizes Cloud Functions to automate payroll processing based on validated geofenced clock-ins, reducing administrative overhead by 40%.",
        impact: [
            {
                label: "Admin Time Saved",
                value: "-40%",
                description: "Reduction in weekly payroll and billing processing time.",
            },
            {
                label: "Revenue Leakage",
                value: "0%",
                description: "Elimination of lost billable hours via digital logs.",
            },
            {
                label: "Fleet Efficiency",
                value: "+22%",
                description: "Increase in daily job throughput per crew.",
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
