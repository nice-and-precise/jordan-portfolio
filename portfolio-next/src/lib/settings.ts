import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface SiteSettings {
    heroTitle: string;
    heroSubtitle: string;
    introText: string;
    contactEmail: string;
    footerLinks: { label: string; url: string }[];
    googleApiKey?: string;
    resumeUrl?: string;
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
    resumeUrl: ""
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
