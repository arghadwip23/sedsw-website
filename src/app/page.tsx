"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function EarthModel() {
  const { scene } = useGLTF("/models/earth.glb");
  const ref = useRef<THREE.Group>(null);

  // Rotate slowly from west to east (Y axis)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01; // Adjust speed as needed
    }
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={2} />
    </group>
  );
}

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <Canvas camera={{ position: [100, 0, 300], fov: 40 }}>
        {/* Strong sunlamp */}
        <directionalLight
          position={[-20, 5, 0]}
          intensity={10}
          castShadow
          color="#ffffff"
        />
        <ambientLight intensity={0.5} />
        {/* Move the model to the bottom right */}
        <group position={[80, -60, 0]}>
          <EarthModel />
        </group>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

