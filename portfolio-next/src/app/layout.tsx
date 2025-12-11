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
        {/* Service Worker removed during debugging to ensure clean state */}
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
