"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle Redirect Result (Successful Login Return)
        getRedirectResult(auth).then((result) => {
            if (result) {
                console.log("Redirect login success:", result.user);
            }
        }).catch((error) => {
            console.error("Redirect login error:", error);
        });

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Safety timeout to prevent infinite loading state
        const timer = setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    console.warn("Auth state change timeout hit - forcing loading false");
                    return false;
                }
                return prev;
            });
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
