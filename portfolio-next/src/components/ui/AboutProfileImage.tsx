'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function AboutProfileImage() {
    const [imageError, setImageError] = useState(false);

    // Prompt for Nano Banana
    const nanoBananaPrompt = "Using the uploaded photo of Jordan, generate a high-end corporate headshot. Maintain the subject's facial features exactly but improve the lighting to be 'cinematic studio quality' and change the background to a blurred, modern tech office. Style: Trustworthy, Competent, Leadership.";

    if (imageError) {
        return (
            <div className="w-full aspect-square md:aspect-[3/4] bg-neutral-900 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

                {/* Placeholder Icon */}
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                    <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                <h3 className="text-white font-medium mb-2">Image Missing</h3>
                <p className="text-xs text-neutral-500 max-w-[200px] mb-6">
                    Place 'about-profile.jpg' in public/assets/images/
                </p>

                {/* Helpful Prompt for User */}
                <div className="text-left w-full bg-black/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                    <p className="text-[10px] text-blue-400 font-mono mb-2 uppercase tracking-wider">Nano Banana Prompt:</p>
                    <p className="text-[10px] text-neutral-400 font-mono leading-relaxed select-all">
                        {nanoBananaPrompt}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            <Image
                src="/assets/images/about-profile.jpg"
                alt="Jordan - Operational Strategist"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority
            />
        </div>
    );
}
