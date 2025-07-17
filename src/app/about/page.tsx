"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
//import dynamic from "next/dynamic";

// 🌕 Import your converted moon model
 import {Moon} from "@/components/Moon2"; // adjust path as needed
//import { div } from "framer-motion/client";


// import { useRef, useState, useEffect } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Moon } from "@/components/Moon2";
// import * as THREE from "three";
export function MoonScene() {
  const ref = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ xSpeed: 0, ySpeed: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      setLastMouse({ x: e.clientX, y: e.clientY });

      setRotation({
        xSpeed: deltaY * 0.01, // vertical drag rotates X
        ySpeed: deltaX * 0.01, // horizontal drag rotates Y
      });
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, lastMouse]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotation.ySpeed;
      ref.current.rotation.x += rotation.xSpeed;

      // Inertia (friction)
      setRotation((prev) => ({
        xSpeed: prev.xSpeed * 0.55,
        ySpeed: prev.ySpeed * 0.55,
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
    
    <div className="w-full h-screen flex flex-col justify-center relative">
      <div className=" absolute top-30  p-4 lg:pl-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit,
sit amet feugiat lectus. Class aptent taciti sociosqu ad litora 
torquent per conubia nostra, per inceptos himenaeos.
Praesent auctor purus luctus enim egestas,
ac scelerisque ante
      </div>
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999]">
        {isClient && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: true }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight intensity={3} position={[2, 3, -2]} />
            <MoonScene />
            <OrbitControls enableZoom={false} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
