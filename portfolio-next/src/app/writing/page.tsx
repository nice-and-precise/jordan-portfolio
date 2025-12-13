import { getAllPosts } from "@/lib/writing";
import { Metadata } from "next";
import WritingContent from "@/components/WritingContent";

export const metadata: Metadata = {
    title: "Writing | Jordan",
    description: "Thoughts on architecture, engineering, and design.",
};

export default async function WritingPage() {
    const posts = await getAllPosts();
    return <WritingContent initialPosts={posts} />;
}
