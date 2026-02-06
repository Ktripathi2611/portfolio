"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ImmersiveEntry = dynamic(() => import("@/components/immersive/ImmersiveEntry"), { ssr: false });
const SpaceEffects = dynamic(() => import("@/components/immersive/SpaceEffects"), { ssr: false });

export default function ImmersiveWrapper({ children }: { children: React.ReactNode }) {
    const [showEntry, setShowEntry] = useState(true);
    const [entryComplete, setEntryComplete] = useState(false);

    useEffect(() => {
        // Check if user has seen the intro before
        const hasSeenIntro = localStorage.getItem("hasSeenIntro");
        if (hasSeenIntro) {
            setShowEntry(false);
            setEntryComplete(true);
        }
    }, []);

    const handleEntryComplete = () => {
        setEntryComplete(true);
        setShowEntry(false);
        localStorage.setItem("hasSeenIntro", "true");
    };

    return (
        <>
            {showEntry && !entryComplete && <ImmersiveEntry onComplete={handleEntryComplete} />}
            {entryComplete && <SpaceEffects />}
            {children}
        </>
    );
}
