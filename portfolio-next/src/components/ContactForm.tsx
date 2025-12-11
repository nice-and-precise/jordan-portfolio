"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) return;

        setStatus("submitting");
        try {
            await addDoc(collection(db, "inquiries"), {
                email,
                message,
                createdAt: serverTimestamp(),
                source: "portfolio-contact-form"
            });
            setStatus("success");
            setEmail("");
            setMessage("");
            setTimeout(() => {
                setIsOpen(false);
                setStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                <h3 className="text-emerald-400 font-bold text-xl mb-2">Message Received</h3>
                <p className="text-emerald-500/80">I&apos;ll be in touch shortly.</p>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
            >
                Start a Conversation
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-white font-bold text-xl mb-4">Initialize Contact</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-neutral-500 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm text-neutral-500 mb-1">Message</label>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="Let's build something..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold rounded-lg transition-all disabled:opacity-50"
                    >
                        {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                </div>
                {status === "error" && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
            </div>
        </form>
    );
}
