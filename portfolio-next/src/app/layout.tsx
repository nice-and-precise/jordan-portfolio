import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jordan | Full-Stack Engineer & Creative Developer",
  description: "Portfolio of a Full-Stack Engineer specializing in Next.js, React, and scalable systems. Building high-performance implementations that defy expectations.",
  keywords: ["Full Stack", "React", "Next.js", "Creative Developer", "Software Engineer", "Portfolio"],
  openGraph: {
    title: "Jordan | Full-Stack Engineer",
    description: "Building high-performance implementations that defy expectations.",
    type: "website",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        {children}
      </body>
    </html>
  );
}
