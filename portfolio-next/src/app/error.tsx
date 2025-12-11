"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-neutral-400 mb-8 max-w-md text-center">
                We encountered an error loading this section. Please try again.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
