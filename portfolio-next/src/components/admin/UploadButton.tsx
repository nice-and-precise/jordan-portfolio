"use client";

import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

export default function UploadButton({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            onUploadComplete(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*"
            />
            <label
                htmlFor="file-upload"
                className={`px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-sm text-white cursor-pointer transition-colors inline-block ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {uploading ? "Uploading..." : "Upload Image"}
            </label>
        </div>
    );
}
