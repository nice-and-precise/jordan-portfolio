const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Data from src/data/projects.ts
const PROJECTS = [
    {
        slug: "midwest-underground-ops",
        title: "Midwest Underground Ops",
        subtitle: "The Digital Transformation of Utility Coordination",
        coverImage: "/images/ops-cover.jpg",
        overview:
            "A comprehensive Operations Management System designed to streamline underground utility coordination. By digitizing the entire workflow from project tracking to resource allocation and compliance documentation, we replaced fragmented legacy processes with a unified, real-time platform.",
        challenge:
            "Midwest Underground faced a critical bottleneck: field data collection was manual, error-prone, and disconnected from the central office. Coordinating widespread crews and ensuring compliance with strict safety regulations (OSHA, 811) required a solution that was resilient enough for the field but powerful enough for the boardroom.",
        techStack: ["React", "TypeScript", "Firebase Firestore", "Google Maps API", "PWA"],
        technicalDeepDive:
            "Built as a Progressive Web App (PWA) to ensure offline-first capability for field crews in remote locations. The architecture leverages Firebase Firestore for real-time data synchronization, allowing office dispatchers to see crew locations and status updates instantly. We implemented a custom geospatial tracking module using the Google Maps API to visualize project boundaries and asset locations overlayed with 811 locate tickets.",
        impact: [
            {
                label: "Throughput Increase",
                value: "63%",
                description: "Significant productivity gains via streamlined workflows.",
            },
            {
                label: "Reporting Time",
                value: "-40%",
                description: "Reduction in manual data entry and report generation time.",
            },
            {
                label: "On-Time Delivery",
                value: "95%",
                description: "Consistent project completion within scope and timeline.",
            },
        ],
        role: [
            "Lead Frontend Architect",
            "UX/UI Designer",
            "Process Engineer",
        ],
    },
    {
        slug: "process-optimization-framework",
        title: "Lean Velocity",
        subtitle: "Manufacturing at Scale",
        coverImage: "/images/process-cover.jpg",
        overview:
            "A scalable, reusable framework for identifying production bottlenecks and implementing lean methodologies across distributed manufacturing teams. This project wasn't just software; it was a digital codification of Lean Six Sigma principles.",
        challenge:
            "Scaling production across multiple facilities introduced inconsistencies in quality and throughput. The challenge was to create a digital 'nervous system' that could monitor standard operating procedures (SOPs) and flag deviations in real-time, without disrupting the high-velocity shop floor environment.",
        techStack: ["Vue.js", "Node.js", "InfluxDB", "WebSocket", "D3.js"],
        technicalDeepDive:
            "The core of the system is a high-frequency time-series database (InfluxDB) that ingests machine telemetry. We built a custom WebSocket layer to broadcast these metrics to shop floor dashboards with sub-second latency. The frontend uses D3.js to render live control charts (X-bar, R charts) that visually alert operators when a process drifts out of control limits.",
        impact: [
            {
                label: "Defect Reduction",
                value: "22%",
                description: "Decrease in rework due to real-time quality alerts.",
            },
            {
                label: "OEE Improvement",
                value: "15%",
                description: "Increase in Overall Equipment Effectiveness.",
            },
            {
                label: "ROI",
                value: "12mo",
                description: "Full return on investment achieved within one year.",
            },
        ],
        role: ["Full Stack Developer", "Data Visualization Specialist"],
    },
    {
        slug: "executive-dashboard-system",
        title: "Nexus Dashboard",
        subtitle: "The Executive Eye",
        coverImage: "/images/dash-cover.jpg",
        overview:
            "A centralized Executive Dashboard System that aggregates data from disparate sources (ERP, CRM, Field Ops) into a single pane of glass. It provides leadership with actionable, real-time insights to drive strategic decision-making.",
        challenge:
            "Executives were drowning in spreadsheets. Key performance indicators (KPIs) were reported with a 2-week lag, making proactive management impossible. The goal was to break down data silos and deliver a 'live pulse' of the organization.",
        techStack: ["Next.js", "GraphQL", "PostgreSQL", "Recharts", "Tailwind CSS"],
        technicalDeepDive:
            "We engineered a federated GraphQL API to stitch together data from legacy SQL databases and modern SaaS APIs. This unified schema feeds a Next.js frontend rendered with Incremental Static Regeneration (ISR) to balance data freshness with page performance. The visualization layer uses Recharts for responsive, interactive components that allow executives to drill down from high-level year-to-date metrics to individual transaction details.",
        impact: [
            {
                label: "Decision Latency",
                value: "Real-time",
                description: "Moved from monthly reports to live data streams.",
            },
            {
                label: "Data Accuracy",
                value: "99.9%",
                description: "Eliminated human error in manual spreadsheet aggregation.",
            },
            {
                label: "Adoption",
                value: "100%",
                description: "Became the default view for all C-suite meetings.",
            },
        ],
        role: ["Frontend Lead", "API Designer"],
    },
];

async function seedRichData() {
    const projectsCol = db.collection('projects');
    const batch = db.batch();

    console.log("Seeding Rich Project Data...");

    // First, let's query for existing projects by slug (if they exist) or title to update them
    // Or we can just wipe and recreate to be clean.
    // Given the duplicates from before, wiping might be nice, but "delete" is heavy.
    // Let's just add new ones with specific IDs based on slug to ensure uniqueness.

    for (const project of PROJECTS) {
        const docRef = projectsCol.doc(project.slug); // Use slug as ID
        batch.set(docRef, project, { merge: true });
        console.log(`Prepared: ${project.slug}`);
    }

    await batch.commit();
    console.log("Seed Complete!");
}

seedRichData().catch(console.error);
