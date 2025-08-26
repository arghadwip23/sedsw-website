"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function GridBackground() {
  const gridRef = useRef<THREE.Object3D>(null!);

  // Animate slight pulsing / rotation
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.z = state.clock.elapsedTime * 0.02; // slow spin
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        args={[100, 100]} // grid size
        cellSize={1}
        cellThickness={0.5}
        cellColor={"#00ffff"} // cyan lines
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={"#ff00ff"} // magenta bold lines
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid // makes it endless
      />
    </group>
  );
}

export default function StarryBackground() {
  return (
    <Canvas
      className="relative  inset-0 -z-4 w-screen h-screen"
      camera={{ position: [0, 20, 40], fov: 60 }}
    >
      {/* Lighting to make lines glow */}
      <ambientLight intensity={10} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ffff" />
      <GridBackground />
    </Canvas>
  );
}
