import React from "react";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/data";
import LiveCaseStudy from "@/components/case-study/LiveCaseStudy";

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Case Study`,
        description: project.subtitle,
        openGraph: {
            title: project.title,
            description: project.overview,
            images: [project.coverImage],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": project.title,
        "description": project.overview,
        "programmingLanguage": project.techStack,
        "author": {
            "@type": "Person",
            "name": "Jordan"
        },
        "dateCreated": "2024-01-01",
        "dateModified": new Date().toISOString()
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LiveCaseStudy initialProject={project} />
        </>
    );
}
