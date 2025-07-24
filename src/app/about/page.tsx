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
  function MoonScene() {
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
    
    <div className="w-full h-screen flex flex-col justify-center relative bg-black -z-[10]">
      <div className=" absolute top-20 md:top-40 lg:top-40   px-2 lg:pl-10 lg:flex gap-20 justify-between items-center ">
       <div>
        <p className="lg:pr-20 lg:w-[70%]"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metu nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit,
sit amet feugiat lectus. Class aptent taciti sociosqu ad litora 
torquent per conubia nostra, per inceptos himenaeos.
Praesent auctor purus luctus enim egestas,
ac scelerisque ante</p>
       </div>
<div className="flex justify-end mt-20 lg:mt-0 ">
  <div className="text-left">
    <h2 className="font-semibold text-3xl tracking-wider">About&nbsp;Us</h2>
    
    <table className="table-fixed w-[300px] mt-4  border-separate border-spacing-y-4">
      <tbody>
        <tr>
          <td className="p-2"><img src="./aboutHome.svg" alt="Home" /></td>
          <td>2021-20XX</td>
        </tr>
        <tr>
          <td className="p-2"><img src="./aboutGroup.svg" alt="Group" /></td>
          <td>200+ members</td>
        </tr>
        <tr>
          <td className="p-2"><img src="./aboutEvents.svg" alt="Events" /></td>
          <td>60+ events</td>
        </tr>
        <tr>
          <td className="p-2"><img src="./aboutLocation.svg" alt="Location" /></td>
          <td>VIT Chennai</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      </div>
      <div className=" w-full h-[50vh] lg:w-full lg:h-screen fixed bg-black  bottom-0  lg:top-0 left-0 -z-[9]">
        {isClient && (
          <Canvas
            camera={{ position: [0, 0, 5.3], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: true }}
           className="bg-black">
            <ambientLight intensity={0.5} />
            <directionalLight intensity={5} position={[0, 10, -10]} />
             <pointLight
    position={[0, 10, -50]} // behind the moon
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
