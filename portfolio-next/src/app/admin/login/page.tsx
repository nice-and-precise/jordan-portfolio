"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/admin");
        }
    }, [user, router]);

    if (loading) return <div className="min-h-screen grid place-items-center bg-slate-950 text-white">Loading...</div>;

    return (
        <div className="min-h-screen grid place-items-center bg-slate-950 text-white p-6">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-xl text-center">
                <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
                <p className="text-slate-400 mb-8">System Entry Point</p>

                <button
                    onClick={() => signInWithGoogle()}
                    className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
