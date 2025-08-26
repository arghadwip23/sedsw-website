"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

// 🌌 Star Field Component
function Stars() {
  const ref = useRef<THREE.Points>(null!);

  // Generate random star positions once
  const positions = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000 * 3; i++) pos[i] = (Math.random() - 0.5) * 300;
    return pos;
  }, []);

  // Rotate stars slowly and respond to mouse movement
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.mouse.x * 0.5;
    ref.current.rotation.x = -state.mouse.y * 0.5;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// ☀️ Glowing Planet / Sun
function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Gentle pulse animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        emissive={"#ff66cc"}
        emissiveIntensity={2.5}
        color={"#330033"}
      />
    </mesh>
  );
}

// 🎨 The Background Component
export default function CosmicBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      className="absolute inset-0 -z-10"
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color={"#ff99cc"} />

      <GlowSphere />
      <Stars />
    </Canvas>
  );
}
