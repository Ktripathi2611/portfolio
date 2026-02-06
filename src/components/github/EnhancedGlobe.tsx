"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { adaptiveFPS } from "@/lib/webgl/AdaptiveFPSController";
import Satellite from "../satellite/Satellite";
import type { EnhancedCommit } from "@/lib/github/githubDataService";

interface EnhancedGlobeProps {
    commits: EnhancedCommit[];
    selectedCommit: EnhancedCommit | null;
    onCommitClick: (commit: EnhancedCommit) => void;
    heatmapMode: boolean;
}

interface MarkerProps {
    position: THREE.Vector3;
    commit: EnhancedCommit;
    isSelected: boolean;
    onClick: () => void;
    heatmapMode: boolean;
}

// Activity Marker Component
function ActivityMarker({ position, commit, isSelected, onClick, heatmapMode }: MarkerProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
            meshRef.current.scale.setScalar(pulse * (hovered || isSelected ? 1.5 : 1));
        }
    });

    const color = getLanguageColor(commit.language);

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={onClick}
            >
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial
                    color={heatmapMode ? "#ff6600" : color}
                    emissive={heatmapMode ? "#ff6600" : color}
                    emissiveIntensity={heatmapMode ? 2 : (hovered || isSelected ? 2 : 1)}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {(hovered || isSelected) && (
                <Html distanceFactor={10}>
                    <div
                        className="px-4 py-3 rounded-lg text-xs pointer-events-none"
                        style={{
                            backgroundColor: "rgba(15, 15, 25, 0.95)",
                            border: `1px solid ${color}66`,
                            minWidth: "220px",
                            maxWidth: "280px",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <div className="font-semibold text-white text-sm mb-2">{commit.repo}</div>
                        <div className="text-white/80 mb-2 line-clamp-2">{commit.message}</div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">{new Date(commit.date).toLocaleDateString()}</span>
                            {commit.stars > 0 && (
                                <span className="text-yellow-400">⭐ {commit.stars}</span>
                            )}
                        </div>
                        {commit.language && (
                            <div
                                className="mt-2 text-xs px-2 py-1 rounded inline-block"
                                style={{
                                    backgroundColor: color + "33",
                                    color: color,
                                }}
                            >
                                {commit.language}
                            </div>
                        )}
                    </div>
                </Html>
            )}
        </group>
    );
}

// Earth Component
function Earth({
    commits,
    selectedCommit,
    onCommitClick,
    heatmapMode,
    globeSegments,
}: {
    commits: EnhancedCommit[];
    selectedCommit: EnhancedCommit | null;
    onCommitClick: (commit: EnhancedCommit) => void;
    heatmapMode: boolean;
    globeSegments: number;
}) {
    const earthRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);

        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    };

    return (
        <>
            {/* Earth sphere */}
            <Sphere ref={earthRef} args={[1, globeSegments, globeSegments]}>
                <meshStandardMaterial
                    color={heatmapMode ? "#1a0a0a" : "#1a1a2e"}
                    roughness={0.8}
                    metalness={0.2}
                    emissive={heatmapMode ? "#ff3300" : "#0f0f1a"}
                    emissiveIntensity={heatmapMode ? 0.3 : 0.2}
                />
            </Sphere>

            {/* Atmospheric glow */}
            <Sphere ref={atmosphereRef} args={[1.05, 32, 32]}>
                <meshBasicMaterial
                    color={heatmapMode ? "#ff6600" : "#00d4ff"}
                    transparent
                    opacity={heatmapMode ? 0.2 : 0.1}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Activity markers */}
            {commits.map((commit) => {
                const position = latLngToVector3(commit.coordinates.lat, commit.coordinates.lng, 1.02);
                return (
                    <ActivityMarker
                        key={commit.sha}
                        position={position}
                        commit={commit}
                        isSelected={selectedCommit?.sha === commit.sha}
                        onClick={() => onCommitClick(commit)}
                        heatmapMode={heatmapMode}
                    />
                );
            })}
        </>
    );
}

// Main Scene
function Scene({
    commits,
    selectedCommit,
    onCommitClick,
    heatmapMode,
    globeSegments,
}: {
    commits: EnhancedCommit[];
    selectedCommit: EnhancedCommit | null;
    onCommitClick: (commit: EnhancedCommit) => void;
    heatmapMode: boolean;
    globeSegments: number;
}) {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight
                position={[-10, -10, -10]}
                intensity={0.3}
                color={heatmapMode ? "#ff6600" : "#a855f7"}
            />

            <Earth
                commits={commits}
                selectedCommit={selectedCommit}
                onCommitClick={onCommitClick}
                heatmapMode={heatmapMode}
                globeSegments={globeSegments}
            />
            <Satellite radius={1.8} speed={0.3} />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={5}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

// Loading fallback
function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/50 text-sm">Initializing globe...</div>
        </div>
    );
}

// Main Component
export default function EnhancedGlobe({
    commits,
    selectedCommit,
    onCommitClick,
    heatmapMode,
}: EnhancedGlobeProps) {
    const [globeSegments, setGlobeSegments] = useState(64);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Mount ready
        setIsReady(true);

        // Subscribe to quality changes
        adaptiveFPS.subscribe("enhanced-globe", (tier, settings) => {
            setGlobeSegments(settings.globeSegments);
        });

        return () => {
            adaptiveFPS.unsubscribe("enhanced-globe");
        };
    }, []);

    if (!isReady) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white/70 text-lg mb-2">🌍</div>
                    <div className="text-white/50 text-sm">Loading globe...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 3], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <Scene
                        commits={commits}
                        selectedCommit={selectedCommit}
                        onCommitClick={onCommitClick}
                        heatmapMode={heatmapMode}
                        globeSegments={globeSegments}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

function getLanguageColor(language: string | null): string {
    if (!language) return "#888888";
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Java: "#b07219",
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
    };
    return colors[language] || "#888888";
}
