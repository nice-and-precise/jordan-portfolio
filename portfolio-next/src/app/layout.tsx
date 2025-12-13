import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/FloatingNav";
import ChatWidget from "@/components/ChatWidget";
import { getSiteSettings } from "@/lib/settings";
import { getAllProjects, getAllServices } from "@/lib/data";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.heroTitle ? `${settings.heroTitle} | ${settings.heroSubtitle}` : "Jordan | Full-Stack Engineer";
  const description = settings.introText || "Portfolio of a Full-Stack Engineer specialized in scalable architecture.";

  return {
    metadataBase: new URL('https://jordan-7d673.web.app'),
    title: title,
    description: description,
    keywords: ["Full Stack", "React", "Next.js", "Creative Developer", "Software Engineer", "Portfolio"],
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const projects = await getAllProjects();
  const services = await getAllServices();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "dateCreated": "2024-01-01T00:00:00-05:00",
              "dateModified": new Date().toISOString(),
              "mainEntity": {
                "@type": "Person",
                "name": "Jordan",
                "alternateName": "Operational Excellence Partner",
                "description": "Full-Stack Engineer specialized in turning Entropy into Order. Expert in Next.js, Systems Architecture, and Business Process Automation.",
                "image": "https://jordan-7d673.web.app/headshot.jpg",
                "jobTitle": "Strategic Software Engineer",
                "sameAs": [
                  "https://github.com/jordan-portfolio",
                  "https://linkedin.com/in/jordan-portfolio"
                ]
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Basic Service Worker Cleanup (Safe)
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}
      >
        {/* Cache Bust: 2025-12-11 - Resolve Sticky Headers */}
        <FloatingNav settings={settings} />
        {children}
        {settings.showChatWidget && <ChatWidget settings={settings} projects={projects} services={services} />}
      </body>
    </html>
  );
}
