"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FaStar, FaCodeBranch, FaExternalLinkAlt } from "react-icons/fa";
import { fetchGitHubActivity, GitHubRepo } from "@/lib/github/githubDataService";
import Satellite from "../satellite/Satellite";

interface MarkerProps {
    position: THREE.Vector3;
    repo: GitHubRepo;
    onHoverChange: (isHovered: boolean) => void;
}

// Compact Repository Marker
function RepoMarker({ position, repo, onHoverChange }: MarkerProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const handleHover = (isHovered: boolean) => {
        setHovered(isHovered);
        onHoverChange(isHovered);
    };

    useFrame((state) => {
        if (meshRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 3 + repo.id) * 0.3 + 1;
            meshRef.current.scale.setScalar(pulse * (hovered ? 1.8 : 1));
        }
        if (glowRef.current) {
            const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            glowRef.current.scale.setScalar(glowPulse * 2);
        }
    });

    const color = getLanguageColor(repo.language);
    const markerSize = Math.max(0.04, Math.min(0.07, 0.04 + (repo.stargazers_count / 50) * 0.015));

    return (
        <group position={position}>
            {/* Outer glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[markerSize * 1.5, 12, 12]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Main marker */}
            <mesh
                ref={meshRef}
                onPointerEnter={() => handleHover(true)}
                onPointerLeave={() => handleHover(false)}
            >
                <sphereGeometry args={[markerSize, 12, 12]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2.5 : 1.2}
                />
            </mesh>

            {/* Minimal Popup */}
            {hovered && (
                <Html distanceFactor={8} zIndexRange={[100, 0]}>
                    <div
                        className="pointer-events-auto cursor-pointer whitespace-nowrap"
                        style={{
                            background: "rgba(10,10,20,0.9)",
                            border: `1px solid ${color}`,
                            borderRadius: "6px",
                            padding: "4px 8px",
                            backdropFilter: "blur(6px)",
                            boxShadow: `0 0 10px ${color}30`,
                            transform: "translateX(-50%)",
                        }}
                        onClick={() => window.open(repo.html_url, '_blank')}
                    >
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-semibold text-white">{repo.name}</span>
                            <span className="text-yellow-400">⭐{repo.stargazers_count}</span>
                            {repo.language && (
                                <span style={{ color }}>{repo.language}</span>
                            )}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

// Earth with realistic look
function Earth({ repos, isPaused, onMarkerHover }: { repos: GitHubRepo[]; isPaused: boolean; onMarkerHover: (h: boolean) => void }) {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Create procedural Earth texture
    const earthTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;

        // Ocean gradient
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, 512);
        oceanGradient.addColorStop(0, '#0a1628');
        oceanGradient.addColorStop(0.5, '#0d2137');
        oceanGradient.addColorStop(1, '#0a1628');
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, 1024, 512);

        // Draw continents (simplified shapes)
        ctx.fillStyle = '#1a4a3a';
        ctx.strokeStyle = '#2a6a4a';
        ctx.lineWidth = 2;

        // North America
        ctx.beginPath();
        ctx.ellipse(200, 150, 120, 80, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // South America
        ctx.beginPath();
        ctx.ellipse(280, 320, 50, 100, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Europe
        ctx.beginPath();
        ctx.ellipse(520, 130, 60, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Africa
        ctx.beginPath();
        ctx.ellipse(540, 280, 70, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Asia
        ctx.beginPath();
        ctx.ellipse(700, 160, 150, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Australia
        ctx.beginPath();
        ctx.ellipse(820, 350, 50, 40, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Add some noise/texture
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
            ctx.fillRect(x, y, 2, 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    useFrame(() => {
        if (isPaused) return; // Stop rotation on hover
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0008;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.001;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    };

    return (
        <>
            {/* Earth sphere with texture */}
            <Sphere ref={earthRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.8}
                    metalness={0.1}
                    emissive="#0a1020"
                    emissiveIntensity={0.2}
                />
            </Sphere>

            {/* Cloud layer */}
            <Sphere ref={cloudsRef} args={[1.02, 32, 32]}>
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.08}
                    roughness={1}
                />
            </Sphere>

            {/* Atmospheric glow - blue */}
            <Sphere ref={atmosphereRef} args={[1.1, 32, 32]}>
                <meshBasicMaterial
                    color="#4da6ff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Inner atmospheric rim */}
            <Sphere args={[1.05, 32, 32]}>
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Repository markers */}
            {repos.map((repo) => {
                const position = latLngToVector3(repo.coordinates.lat, repo.coordinates.lng, 1.08);
                return <RepoMarker key={repo.id} position={position} repo={repo} onHoverChange={onMarkerHover} />;
            })}
        </>
    );
}

// Main Scene
function Scene({ isPaused, onMarkerHover }: { isPaused: boolean; onMarkerHover: (h: boolean) => void }) {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);

    useEffect(() => {
        fetchGitHubActivity().then((data) => {
            setRepos(data.repos.slice(0, 15));
        });
    }, []);

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
            <pointLight position={[0, 10, 0]} intensity={0.2} color="#00d4ff" />

            <Earth repos={repos} isPaused={isPaused} onMarkerHover={onMarkerHover} />
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

function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/50 text-sm">Initializing globe...</div>
        </div>
    );
}

export default function GitHubGlobe() {
    const [isReady, setIsReady] = useState(false);
    const [markerHovered, setMarkerHovered] = useState(false);
    const [clickPaused, setClickPaused] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    // Handle click to pause for 7 seconds
    const handleClick = () => {
        setClickPaused(true);
        setTimeout(() => setClickPaused(false), 7000);
    };

    // Pause when marker hovered OR clicked
    const shouldPause = markerHovered || clickPaused;

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
        <div className="w-full h-full" onClick={handleClick}>
            <Canvas
                camera={{ position: [0, 0, 3], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <Scene isPaused={shouldPause} onMarkerHover={setMarkerHovered} />
                </Suspense>
            </Canvas>
        </div>
    );
}

function getLanguageColor(language: string | null): string {
    if (!language) return "#00d4ff";
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Java: "#b07219",
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
        "C++": "#f34b7d",
        C: "#555555",
        Swift: "#ffac45",
        Kotlin: "#F18E33",
        PHP: "#4F5D95",
        Ruby: "#701516",
    };
    return colors[language] || "#00d4ff";
}
