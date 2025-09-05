"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

function Stars({ count }: { count: number }) {
  const starGeometry = useRef<THREE.BufferGeometry>(null);
  const starMaterial = useRef<THREE.PointsMaterial>(null);
  const stars = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [starPositions, starColors] = useMemo(() => {
    let positions = [];
    let colors = [];

  for (let i = 0; i < count; i++) {
      const distance = 15 + Math.random() * 5; // Stars start farther away
      const x = (Math.random() - 0.5) * distance;
      const y = (Math.random() - 0.5) * distance;
      const z = (Math.random() - 0.5) * distance;
      positions.push(x, y, z);

      let color = new THREE.Color();
      const colorOptions = ["white", "lightyellow", "paleblue"];
      color.setStyle(
        colorOptions[Math.floor(Math.random() * colorOptions.length)]
      );
      colors.push(color.r, color.g, color.b);
    }

  return [new Float32Array(positions), new Float32Array(colors)];
  }, [count]);

  useEffect(() => {
    if (!starGeometry.current) {
      starGeometry.current = new THREE.BufferGeometry();
    }

    starGeometry.current.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    starGeometry.current.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3)
    );

    if (!starMaterial.current) {
      starMaterial.current = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
    }

    if (!stars.current) {
      stars.current = new THREE.Points(starGeometry.current, starMaterial.current);
    }

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
  }, [starColors, starPositions]);

  useFrame(() => {
    if (stars.current) {
      // Apply rotation based on mouse position
      stars.current.rotation.y = THREE.MathUtils.lerp(
        stars.current.rotation.y,
        mousePosition.x * 0.05, // Adjust sensitivity as needed
        0.1 // Adjust smoothing factor as needed
      );
      stars.current.rotation.x = THREE.MathUtils.lerp(
        stars.current.rotation.x,
        -mousePosition.y * 0.05, // Adjust sensitivity as needed
        0.1 // Adjust smoothing factor as needed
      );
    }
  });

  return stars.current ? <primitive object={stars.current} /> : null;
}

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
      {/* Earth 3D Model Background */}
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999]">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1000} />
          <Suspense fallback={null}>
            <EarthModel />
          </Suspense>
          <Stars count={500} />
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

      <div
        className={`w-full h-full z-10 flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        <div className="text-center relative">
          <span className="absolute -inset-2 rounded-3xl blur-md opacity-50 bg-black/50"></span>
          <p className="text-white md:text-5xl text-3xl drop-shadow-lg relative px-4 py-2" style={{ textShadow: '2px 2px 2px rgba(0,0,0,0.8)' }}>Welcome to</p>
          <h1 className="text-white md:text-9xl text-5xl font-extrabold drop-shadow-lg relative px-4 py-2" style={{ textShadow: '2px 2px 2px rgba(0,0,0,0.8)', letterSpacing: '1px' }}>SEDS ANTARIKSH</h1>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <Link
            href={"/about"}
            className="group relative p-4 border-2 border-white/30 flex justify-center items-center backdrop-blur-xl rounded-2xl active:scale-95 text-white transition-all duration-300 hover:px-6 hover:bg-white hover:text-black overflow-hidden w-40"
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