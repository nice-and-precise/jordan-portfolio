import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { Project, Service, DEFAULT_SERVICES } from "./data";
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
            callback({ ...DEFAULT_SETTINGS, ...doc.data() } as SiteSettings);
        } else {
            callback(DEFAULT_SETTINGS);
        }
    }, (error) => {
        console.error("Settings subscription error:", error);
    });
}
export function subscribeToServices(callback: (services: Service[]) => void) {
    const q = query(collection(db, "services"), orderBy("order", "asc"));

    return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            const services = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];
            callback(services);
        } else {
            // Fallback to static defaults if DB is empty
            // We give them stable IDs based on their index or content if needed, 
            // but for display, the static IDs in DEFAULT_SERVICES are fine.
            callback(DEFAULT_SERVICES);
        }
    }, (error) => {
        console.error("Services subscription error:", error);
        callback(DEFAULT_SERVICES);
    });
}
