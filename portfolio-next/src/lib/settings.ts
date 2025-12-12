import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface SiteSettings {
    heroTitle: string;
    heroSubtitle: string;
    introText: string;
    contactEmail: string;
    footerLinks: { label: string; url: string }[];
    heroPersona?: 'aggressive' | 'empathetic' | 'visionary';
    googleApiKey?: string;
    resumeUrl?: string;

    // Teaser Section
    teaserTitle: string;
    teaserBody: string;
    teaserCtaText: string;

    // Methodology Section
    methodologyTitle: string;
    methodologySubtitle: string;
    methodologyBody: string;
    methodologyList: string[];

    // Stats (Methodology)
    stats: { label: string; value: string }[];

    // About Page
    aboutTitle: string;
    aboutSubtitle: string;
    aboutBody1: string;
    aboutBody2: string;
    aboutBody3: string; // Splitting into paragraphs for better control

    // Capabilities Section (Bento)
    capabilitiesTitle: string;
    capabilitiesSubtitle: string;

    // Calculator Section
    calculatorTitle: string;
    calculatorSubtitle: string;
}

const SETTINGS_DOC_ID = "global";

export const DEFAULT_SETTINGS: SiteSettings = {
    heroTitle: "JORDAN", // Personal Brand
    heroSubtitle: "Full-Stack Engineer × Creative Developer",
    introText: "I build high-performance web applications that meaningful impact business goals. Specializing in Next.js, React, and scalable systems architected for growth.",
    contactEmail: "hello@example.com",
    footerLinks: [
        { label: "GitHub", url: "https://github.com" },
        { label: "LinkedIn", url: "https://linkedin.com" }
    ],
    googleApiKey: "",
    resumeUrl: "",

    teaserTitle: "Who is Jordan?",
    teaserBody: "I bridge the gap between \"sweaty equity\" operations and digital scale. From the fireground to the server room, I build systems that work when it counts.",
    teaserCtaText: "Read My Story",

    methodologyTitle: "The Methodology",
    methodologySubtitle: "Six Sigma Precision. Startup Velocity.",
    methodologyBody: "Most digital transformations fail because they add complexity. I remove it. Using principles from Toyota Production System (Lean) and Kaizen, I architect software that eliminates \"muda\" (waste) from your operations.",
    methodologyList: [
        "Eliminate Manual Data Entry",
        "Reduce Decision Latency",
        "Systematize Quality Control"
    ],

    stats: [
        { label: "Process Reliability", value: "99.9%" },
        { label: "Interaction Latency", value: "<100ms" }
    ],

    aboutTitle: "The Operator's Mindset",
    aboutSubtitle: "Operational Precision.\nTechnical Scalability.",
    aboutBody1: "I am an Operational Strategist and Developer who understands that code is only as good as the process it supports. My background isn't typical for tech, and that's my advantage.",
    aboutBody2: "With over 15 years in high-stakes environments—from commanding fire crews as a Lieutenant to optimizing high-volume manufacturing logistics—I've learned that reliability isn't an accident; it's engineered.",
    aboutBody3: "Today, I leverage AI Agents and Process Intelligence to help businesses scale. I don't just theorize about 'uptime'; I have managed it on the fireground and the factory floor. I operate with the mindset of a business owner, building tools that work and systems that last.",

    capabilitiesTitle: "Capabilities",
    capabilitiesSubtitle: "Operational Architecture",

    calculatorTitle: "Operational Waste Calculator",
    calculatorSubtitle: "Quantify the cost of chaos in your organization."
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const docRef = doc(db, "settings", SETTINGS_DOC_ID);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return snapshot.data() as SiteSettings;
        }

        return DEFAULT_SETTINGS;
    } catch (error) {
        console.warn("Failed to fetch settings, using default:", error);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    // Use setDoc with merge: true to ensure document exists
    await setDoc(docRef, settings, { merge: true });
}
