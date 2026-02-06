"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SatelliteProps {
    radius?: number;
    speed?: number;
    onHoverProject?: (projectName: string | null) => void;
}

export default function Satellite({
    radius = 2,
    speed = 0.5,
    onHoverProject
}: SatelliteProps) {
    const satelliteRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const time = useRef(0);

    useFrame((state, delta) => {
        time.current += delta * speed;

        if (satelliteRef.current) {
            // Orbital motion around the globe
            const x = Math.cos(time.current) * radius;
            const z = Math.sin(time.current) * radius;
            const y = Math.sin(time.current * 0.5) * 0.3; // Slight vertical oscillation

            satelliteRef.current.position.set(x, y, z);

            // Rotate satellite to face direction of travel
            satelliteRef.current.rotation.y = time.current + Math.PI / 2;
        }

        // Blinking light effect
        if (lightRef.current) {
            const blinkSpeed = 2;
            const intensity = Math.abs(Math.sin(state.clock.elapsedTime * blinkSpeed)) * 1.5 + 0.5;
            lightRef.current.intensity = intensity;
        }
    });

    return (
        <group ref={satelliteRef}>
            {/* Satellite body */}
            <mesh>
                <boxGeometry args={[0.08, 0.08, 0.12]} />
                <meshStandardMaterial
                    color="#c0c0c0"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Solar panels */}
            <mesh position={[-0.1, 0, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshStandardMaterial
                    color="#1a3a5c"
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshStandardMaterial
                    color="#1a3a5c"
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>

            {/* Antenna */}
            <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
                <meshStandardMaterial color="#606060" />
            </mesh>

            {/* Blinking signal light */}
            <pointLight
                ref={lightRef}
                position={[0, 0, 0.08]}
                color="#00ff00"
                intensity={1}
                distance={0.5}
            />
            <mesh position={[0, 0, 0.08]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial color="#00ff00" />
            </mesh>

            {/* Satellite glow */}
            <pointLight
                position={[0, 0, 0]}
                color="#00d4ff"
                intensity={0.3}
                distance={0.8}
            />
        </group>
    );
}
