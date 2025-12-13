import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
    title: 'About | Operational Precision. Technical Scalability.',
    description: 'Operational Strategist and Developer bridging the gap between "sweaty equity" manufacturing and digital scale.',
};

export default async function AboutPage() {
    const settings = await getSiteSettings();

    return <AboutContent initialSettings={settings} />;
}
