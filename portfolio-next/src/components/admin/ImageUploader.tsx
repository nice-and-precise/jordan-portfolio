"use client";

import React, { useState } from 'react';
import NextImage from 'next/image';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, Loader2, Check, Sparkles } from 'lucide-react';
import { generateImagePrompt } from '@/lib/gemini';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export default function ImageUploader({ value, onChange, folder = "projects" }: ImageUploaderProps) {
    const [mode, setMode] = useState<'upload' | 'ai'>('upload');
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    // AI State
    const [aiDetails, setAiDetails] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(prog);
            },
            (error) => {
                console.error(error);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onChange(downloadURL);
                    setUploading(false);
                });
            }
        );
    };

    const handleAIGenerate = async () => {
        setAiLoading(true);
        try {
            // Step 1: Optimize Prompt with Gemini
            const enhancedPrompt = await generateImagePrompt(aiDetails);
            setAiPrompt(enhancedPrompt);

            // Step 2: Simulate Image Gen (For this static demo w/o backend billing)
            // In a full production env with paid keys, we'd call DALL-E or Imagen API here.
            // Using Unsplash Source for reliable "Demo" visualization based on keywords.
            const keywords = aiDetails.split(" ").slice(0, 2).join(",");
            const demoUrl = `https://source.unsplash.com/1600x900/?${keywords}&t=${Date.now()}`;

            onChange(demoUrl);
        } catch {
            alert("Please check Gemini API Key configuration.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 border-b border-slate-800">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`pb-2 text-sm font-medium transition-colors ${mode === 'upload' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500'}`}
                >
                    Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode('ai')}
                    className={`pb-2 text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500'}`}
                >
                    <Sparkles className="w-3 h-3" /> AI Generate
                </button>
            </div>

            {mode === 'upload' ? (
                <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-900/50 transition-colors relative group">
                    <input
                        type="file"
                        onChange={handleUpload}
                        accept="image/*"
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                <p className="text-sm text-slate-400">Uploading... {Math.round(progress)}%</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                <p className="text-sm text-slate-400">Drop image here or click to browse</p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                    <div className="bg-indigo-500/10 p-3 rounded border border-indigo-500/20 text-xs text-indigo-300">
                        <strong>Power by Gemini:</strong> Describe your vision, and we&apos;ll engineer the perfect prompt and fetch a visualization.
                    </div>
                    <textarea
                        value={aiDetails}
                        onChange={(e) => setAiDetails(e.target.value)}
                        placeholder="E.g., A cyberpunk dashboard interface with glowing neon text..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={aiLoading || !aiDetails}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate Magic</>}
                    </button>
                    {aiPrompt && (
                        <div className="text-xs text-slate-500 italic mt-2">
                            Generated Prompt: &quot;{aiPrompt}&quot;
                        </div>
                    )}
                </div>
            )}

            {value && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 group">
                    <NextImage src={value} alt="Preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
            )}
        </div>
    );
}
