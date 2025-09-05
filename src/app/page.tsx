"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, OrbitControls, Effects } from "@react-three/drei";
import * as THREE from "three";
import { Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

function EarthModel() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/earth.glb");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1 range
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      // Apply rotation based on mouse position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.x * 0.2 + Math.PI * 1.05, // Adjust sensitivity as needed
        0.1 // Adjust smoothing factor as needed
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mousePosition.y * 0.1 + Math.PI / 7, // Adjust sensitivity as needed
        0.1 // Adjust smoothing factor as needed
      );
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: "100%" }}
            ></div>
          </div>
          <p className="text-white text-lg">Loading Earth...</p>
        </div>
      )}

      {/* Earth 3D Model Background */}
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999]">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1000} />
          <Suspense fallback={null}>
            <EarthModel />
          </Suspense>
          <Bloom
            intensity={1.0} // The bloom intensity.
            blurPass={undefined} // A blur pass.
            kernelSize={KernelSize.LARGE} // blur kernel size
            luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={false} // Enables or disables mipmap blur.
          />
        </Canvas>
      </div>

      <div className={`w-full h-full z-0 flex flex-col justify-center gap-40 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="pl-10">
          <p className="text-white text-2xl">Welcome to</p>
          <h1 className="text-white text-5xl font-extrabold">SEDS ANTARIKSH</h1>
        </div>
        <div className="pl-10 flex items-center align-middle">
          <Link
            href={"/about"}
            className="group relative p-4 border-2 border-white flex justify-center items-center bg-transparent text-white transition-all duration-300 hover:px-6 hover:bg-white hover:text-black overflow-hidden w-40"
          >
            <div className="flex items-center justify-center relative w-full">
              <span className="transition-all duration-300 group-hover:translate-x-[-8px]">
                Learn More
              </span>
              <span className="absolute left-full opacity-0 group-hover:opacity-100 group-hover:translate-x-[-10px] translate-x-[-20px] transition-all duration-300">
                &#8599;
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}