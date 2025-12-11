"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return <div className="min-h-screen grid place-items-center bg-slate-950 text-white">Authenticating...</div>;
    }

    // If on login page, render children (login form)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Otherwise ensure user is authed
    return user ? <>{children}</> : null;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ProtectedRoute>{children}</ProtectedRoute>
        </AuthProvider>
    );
}
