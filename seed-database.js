const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const LEGACY_DATA = {
    outcomes: [
        {
            title: "Throughput Increase",
            description: "Streamlined operations workflow resulting in significant productivity gains for the entire team.",
            value: 63,
            suffix: "%",
            isFeatured: true,
            order: 0
        },
        {
            title: "Time Saved",
            description: "Automated reporting and reduced manual processes.",
            value: 40,
            suffix: "%",
            isFeatured: false,
            order: 1
        },
        {
            title: "On-Time Delivery",
            description: "Consistent project completion within scope and timeline.",
            value: 95,
            suffix: "%",
            isFeatured: false,
            order: 2
        }
    ],
    projects: [
        {
            title: "midwest-underground-ops",
            description: "Operations management system for underground utility coordination. Streamlines project tracking, resource allocation, and compliance documentation.",
            type: "github",
            url: "https://github.com/nice-and-precise/midwest-underground-ops",
            repoOwner: "nice-and-precise",
            repoName: "midwest-underground-ops",
            language: "TypeScript",
            langColor: "#3178c6",
            stars: "Star",
            forks: "Fork",
            order: 0
        },
        {
            title: "Process Optimization Framework",
            description: "Developed a reusable framework for identifying bottlenecks and implementing lean methodologies across distributed teams.",
            type: "standard",
            tags: ["Operations", "Lean", "Process Design"],
            imageUrl: "",
            order: 1
        },
        {
            title: "Executive Dashboard System",
            description: "Real-time KPI tracking dashboard providing leadership with actionable insights and automated reporting.",
            type: "standard",
            tags: ["Data Visualization", "Reporting", "Analytics"],
            imageUrl: "",
            order: 2
        }
    ]
};

async function seed() {
    const batch = db.batch();

    console.log("Seeding Outcomes...");
    const outcomesCol = db.collection('outcomes');

    for (const item of LEGACY_DATA.outcomes) {
        // Create new doc with auto-ID
        const docRef = outcomesCol.doc();
        batch.set(docRef, item);
    }

    console.log("Seeding Projects...");
    const projectsCol = db.collection('projects');
    for (const item of LEGACY_DATA.projects) {
        const docRef = projectsCol.doc();
        batch.set(docRef, item);
    }

    await batch.commit();
    console.log("Seeding Complete!");
}

seed().catch(console.error);
