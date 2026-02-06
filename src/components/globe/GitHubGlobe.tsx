"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { getGitHubActivity, GitHubCommit, getCommitCoordinates } from "@/lib/github/githubApi";
import { performanceMonitor } from "@/lib/webgl/PerformanceMonitor";
import Satellite from "../satellite/Satellite";

interface MarkerProps {
    position: THREE.Vector3;
    commit: GitHubCommit;
}

// Activity Marker Component
function ActivityMarker({ position, commit }: MarkerProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse animation
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
            meshRef.current.scale.setScalar(pulse * (hovered ? 1.5 : 1));
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={hovered ? 2 : 1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {hovered && (
                <Html distanceFactor={10}>
                    <div
                        className="px-3 py-2 rounded-lg text-xs"
                        style={{
                            backgroundColor: "rgba(15, 15, 25, 0.95)",
                            border: "1px solid rgba(0, 212, 255, 0.3)",
                            minWidth: "200px",
                            maxWidth: "250px",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <div className="font-semibold text-white text-sm mb-1">
                            {commit.repo.split("/")[1] || commit.repo}
                        </div>
                        <div className="text-white/70 mb-2 line-clamp-2">
                            {commit.message}
                        </div>
                        <div className="text-white/50 text-xs">
                            {new Date(commit.date).toLocaleDateString()}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

// Earth Component
function Earth({ commits }: { commits: GitHubCommit[] }) {
    const earthRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001; // Slow rotation
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    // Convert lat/lng to 3D coordinates
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
            <Sphere ref={earthRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    color="#1a1a2e"
                    roughness={0.8}
                    metalness={0.2}
                    emissive="#0f0f1a"
                    emissiveIntensity={0.2}
                />
            </Sphere>

            {/* Atmospheric glow */}
            <Sphere ref={atmosphereRef} args={[1.05, 32, 32]}>
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Activity markers */}
            {commits.map((commit) => {
                const coords = getCommitCoordinates(commit);
                const position = latLngToVector3(coords.lat, coords.lng, 1.02);
                return <ActivityMarker key={commit.sha} position={position} commit={commit} />;
            })}
        </>
    );
}

// Main Scene
function Scene() {
    const [commits, setCommits] = useState<GitHubCommit[]>([]);

    useEffect(() => {
        getGitHubActivity().then((activity) => {
            setCommits(activity.commits.slice(0, 10)); // Limit to 10 for performance
        });
    }, []);

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />

            <Earth commits={commits} />
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
export default function GitHubGlobe() {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Check if WebGL should be enabled
        performanceMonitor.initialize();
        const shouldEnable = performanceMonitor.shouldEnableEffects();
        setShouldRender(shouldEnable);
    }, []);

    if (!shouldRender) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white/70 text-lg mb-2">🌍</div>
                    <div className="text-white/50 text-sm">
                        3D Globe disabled for performance
                    </div>
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
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
