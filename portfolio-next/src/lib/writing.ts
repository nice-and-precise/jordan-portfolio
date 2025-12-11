import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

export interface Post {
    slug: string;
    title: string;
    subtitle?: string;
    date: string;
    excerpt: string;
    content: string; // Markdown
    coverImage?: string;
}

export async function getAllPosts(): Promise<Post[]> {
    try {
        const q = query(collection(db, "posts"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            slug: doc.id,
            ...doc.data()
        } as Post));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const docRef = doc(db, "posts", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                slug: docSnap.id,
                ...docSnap.data()
            } as Post;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}
