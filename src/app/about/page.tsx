"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

//import dynamic from "next/dynamic";

// 🌕 Import your converted moon model
 import {Moon} from "@/components/Moon2"; // adjust path as needed
//import { div } from "framer-motion/client";

import DecryptedText from "../../../TextAnimations/DecryptedText/DecryptedText";
import BlurText from "../../../TextAnimations/BlurText/BlurText";


// import { useRef, useState, useEffect } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Moon } from "@/components/Moon2";
// import * as THREE from "three";
  function MoonScene() {
  const ref = useRef<THREE.Group>(null);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number } | null>(null);
  const [mouseInfluence, setMouseInfluence] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (lastMouse) {
        const deltaX = e.clientX - lastMouse.x;
        const deltaY = e.clientY - lastMouse.y;

        // Apply a small influence on rotation speed
        setMouseInfluence({
          x: deltaY * 0.001,
          y: deltaX * 0.001,
        });
      }
      setLastMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastMouse]);

  useFrame(() => {
    if (ref.current) {
      // Base idle rotation
      ref.current.rotation.y += 0.002;

      // Add subtle mouse influence
      ref.current.rotation.x += mouseInfluence.x;
      ref.current.rotation.y += mouseInfluence.y;

      // Slowly fade out mouse influence (like easing)
      setMouseInfluence((prev) => ({
        x: prev.x * 0.9,
        y: prev.y * 0.9,
      }));
    }
  });

  return (
    <group ref={ref} position={[0, -3, 0]} scale={1.7}>
      <Moon />
    </group>
  );
}





export default function About() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // avoid SSR issues with three.js
  }, []);

  return (
    <div className="w-full h-screen flex items-start  pt-0 relative">
      <div className="absolute top-4 md:top-56 md:pb-0 left-0 w-full flex flex-col slef-start items-center  z-10">
        <div className="backdrop-blur-sm border border-white/10 bg-black/10 rounded-3xl shadow-2xl px-8 py-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 min-w-[300px]">
            <DecryptedText
              text="About Us"
              className="font-bold text-4xl md:text-5xl text-white drop-shadow-lg tracking-wider mb-8"
              encryptedClassName="text-blue-200/60"
              parentClassName="mb-2"
              animateOn="view"
              speed={30}
              maxIterations={12}
              revealDirection="center"
            />
            <BlurText
              text="SEDS Antariksh is the official student chapter of SEDS India at VIT Chennai. SEDS stands for Students for the Exploration and Development of Space. As a platform for aspiring astronomers, engineers, and space enthusiasts, we focus on building a strong foundation in space-related domains through workshops, technical projects, outreach events, and competitions. At SEDS Antariksh, we learn, collaborate, and explore the cosmos—together. Our mission is to provide students with opportunities to explore space science."
              className="text-lg md:text-xl text-white/90 font-light leading-relaxed"
              animateBy="words"
              direction="top"
              delay={10}
            />
          </div>
          <div className="flex flex-col items-center flex-1 min-w-full sm:min-w-[300px]">
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="group hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl p-6 w-full">
                <div className="flex items-center center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <img src="./aboutHome.svg" alt="Home" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">Established</p>
                    <p className="text-white text-lg font-semibold">2021-20XX</p>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <img src="./aboutGroup.svg" alt="Group" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">Members</p>
                    <p className="text-white text-lg font-semibold">200+</p>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <img src="./aboutEvents.svg" alt="Events" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">Events</p>
                    <p className="text-white text-lg font-semibold">60+</p>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <img src="./aboutLocation.svg" alt="Location" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">Location</p>
                    <p className="text-white text-lg font-semibold">VIT Chennai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[50vh] lg:w-full lg:h-screen fixed bg-black bottom-0 lg:top-0 left-0 -z-[9]">
        {isClient && (
          <Canvas
            camera={{ position: [0, 0, 5.3], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: true }}
            className="bg-black"
          >
            <ambientLight intensity={0.5} />
            <directionalLight intensity={5} position={[0, 10, -10]} />
            <pointLight
              position={[0, 10, -50]}
              intensity={500}
              color={"#fffbe0"}
              distance={100}
              decay={2}
              castShadow
            />
            <MoonScene />
            <OrbitControls enableZoom={false} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
