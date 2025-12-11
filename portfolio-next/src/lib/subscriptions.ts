import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { Project } from "./data";
import { SiteSettings, DEFAULT_SETTINGS } from "./settings";

export function subscribeToProjects(callback: (projects: Project[]) => void) {
    const q = query(collection(db, "projects"), orderBy("order", "asc")); // Assuming 'order' or just default
    // Fallback if 'order' field doesn't exist, basic query:
    const fallbackQ = collection(db, "projects");

    return onSnapshot(fallbackQ, (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
            slug: doc.id,
            ...doc.data()
        })) as Project[];

        // Optional client-side sort if needed
        // projects.sort(...) 

        callback(projects);
    }, (error) => {
        console.error("Project subscription error:", error);
    });
}

export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
    return onSnapshot(doc(db, "settings", "global"), (doc) => {
        if (doc.exists()) {
            callback(doc.data() as SiteSettings);
        } else {
            callback(DEFAULT_SETTINGS);
        }
    }, (error) => {
        console.error("Settings subscription error:", error);
    });
}
