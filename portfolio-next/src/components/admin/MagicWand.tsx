import React, { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { generateContent } from '@/lib/gemini';

interface MagicWandProps {
    currentValue: string;
    onAccept: (newValue: string) => void;
    context: string;
    className?: string;
}

export default function MagicWand({ currentValue, onAccept, context, className }: MagicWandProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState("");
    const [prompt, setPrompt] = useState("Improve this text");
    const [tone, setTone] = useState("Professional");

    const handleMagic = async () => {
        setLoading(true);
        try {
            const result = await generateContent(`${prompt}: "${currentValue}"`, context, tone);
            setGeneratedText(result);
        } catch (e) {
            alert("Please configure your Gemini API Key in Settings first.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors ${className}`}
                title="Draft with Gemini AI"
            >
                <Sparkles className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="absolute z-50 mt-2 w-80 bg-slate-900 border border-indigo-500/50 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Magic</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                        placeholder="Instruction..."
                    />
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                    >
                        <option value="Professional">Pro</option>
                        <option value="Punchy">Punchy</option>
                        <option value="Technical">Tech</option>
                        <option value="Casual">Casual</option>
                    </select>
                </div>

                <button
                    onClick={handleMagic}
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Generate"}
                </button>

                {generatedText && (
                    <div className="space-y-2">
                        <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 max-h-32 overflow-y-auto">
                            {generatedText}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { onAccept(generatedText); setIsOpen(false); }}
                                className="flex-1 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded text-xs font-medium flex items-center justify-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Use This
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
