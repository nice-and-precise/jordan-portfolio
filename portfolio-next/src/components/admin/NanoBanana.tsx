"use client";

import { useState } from "react";
import { generateVisionContent, generateImagePrompt } from "@/lib/gemini";
import { X, Sparkles, Loader2, Copy, ImageIcon, AlertTriangle, Terminal } from "lucide-react";
import NextImage from "next/image";

interface NanoBananaProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

export default function NanoBanana({ isOpen, onClose, imageUrl }: NanoBananaProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [mode, setMode] = useState<"analyze" | "improve">("analyze");

    if (!isOpen) return null;

    const convertUrlToBase64 = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    // Remove data:image/jpeg;base64, prefix
                    resolve(base64.split(",")[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error(e);
            throw new Error("Could not load image. CORS policies might prevent accessing this URL directly.");
        }
    };

    const handleAction = async () => {
        setAnalyzing(true);
        setError("");
        setResult("");

        try {
            if (mode === "analyze") {
                if (!imageUrl) throw new Error("No image to analyze.");
                const base64 = await convertUrlToBase64(imageUrl);
                const analysis = await generateVisionContent(
                    "Analyze this image. Describe the visual style, subject matter, composition, and technical details (lighting, color palette) in a concise, professional paragraph.",
                    base64
                );
                setResult(analysis);
            } else {
                // Improve/Generate Prompt Mode
                let prompt = "";
                if (imageUrl) {
                    const base64 = await convertUrlToBase64(imageUrl);
                    prompt = await generateVisionContent(
                        "Act as a professional prompt engineer. Analyze this image and write a highly detailed, optimized text-to-image prompt that would recreate a superior, high-fidelity version of this image. Focus on 8k resolution, dramatic lighting, and modern aesthetics.",
                        base64
                    );
                } else {
                    prompt = await generateImagePrompt("A futuristic, high-tech dashboard for a SaaS platform.");
                }
                setResult(prompt);
            }
        } catch (e: any) {
            setError(e.message || "Failed to process image.");
        } finally {
            setAnalyzing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        alert("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-yellow-500/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-yellow-500/20 bg-yellow-500/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🍌</span>
                        <h2 className="font-bold text-yellow-500 tracking-wide font-mono">Nano Banana Pro</h2>
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/20">v2.1 (Vision)</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Image Preview Area */}
                    <div className="flex gap-6">
                        <div className="w-1/3 shrink-0">
                            <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
                                {imageUrl ? (
                                    <NextImage src={imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="text-slate-600 flex flex-col items-center gap-2 p-4 text-center">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-xs">No Image Selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-300 mb-2">Select Operation</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMode("analyze")}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${mode === "analyze" ? "bg-yellow-500 text-black border-yellow-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:border-yellow-500/50"}`}
                                    >
                                        Analyze Visuals
                                    </button>
                                    <button
                                        onClick={() => setMode("improve")}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${mode === "improve" ? "bg-yellow-500 text-black border-yellow-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:border-yellow-500/50"}`}
                                    >
                                        Generate Prompt
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                {mode === "analyze"
                                    ? "Uses Gemini Vision to break down the image's composition, style, and technical attributes."
                                    : "Generates a professional-grade prompt based on this image. Use this prompt in Midjourney, DALL-E, or Imagen to create a higher quality version."}
                            </p>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleAction}
                                disabled={analyzing || !imageUrl}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        {mode === "analyze" ? "Analyze Image" : "Generate Ultra-Prompt"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Result Area */}
                    {(result || analyzing) && (
                        <div className="bg-black/50 border border-slate-800 rounded-lg p-4 relative font-mono text-sm">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 opacity-50" />

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-yellow-500 text-xs flex items-center gap-1">
                                    <Terminal className="w-3 h-3" />
                                    OUTPUT_STREAM
                                </span>
                                {result && (
                                    <button onClick={copyToClipboard} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                )}
                            </div>

                            <div className="text-slate-300 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                                {analyzing ? (
                                    <span className="animate-pulse text-slate-500">Wait... decoding visual matrix...</span>
                                ) : (
                                    result
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
