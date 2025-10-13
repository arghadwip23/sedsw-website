/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import DecryptedText from "../../../TextAnimations/DecryptedText/DecryptedText";
import BlurText from "../../../TextAnimations/BlurText/BlurText";

function MoonModel() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/moon.glb");
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
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.y * 0.2,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mousePosition.x * 0.1 + Math.PI / 5,
        0.1
      );
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={60}
      position={[70, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function About() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-screen flex items-start  pt-0 relative">
      <div className="absolute top-4 md:top-16 md:pb-0 left-0 w-full flex flex-col slef-start items-center  z-10">
          <div className="backdrop-blur-lg border border-white/10 bg-black/20 rounded-3xl shadow-2xl px-8 py-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
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
              {/* Social links: icons from /public/icons, icons white, hide text on mobile, side-by-side on mobile */}
              <div className="mt-6 flex flex-row gap-3 justify-center flex-wrap">
                <a href="https://www.instagram.com/seds_antariksh/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group inline-flex items-center justify-center flex-1 px-3 py-3 rounded-lg border border-white/10 bg-black/20 text-white/90 text-sm font-medium hover:scale-105 transition-all duration-200">
                  {/* inline SVG with fill=currentColor so it can be white via text color */}
                  <svg className="w-10 h-10 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
                    <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="currentColor"/>
                  </svg>
                  <span className="hidden sm:inline-block ml-2">Instagram</span>
                </a>

                <a href="https://www.linkedin.com/company/seds-antariksh-vitc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group inline-flex items-center justify-center flex-1 px-3 py-3 rounded-lg border border-white/10 bg-black/20 text-white/90 text-sm font-medium hover:scale-105 transition-all duration-200">
                  <svg className="w-10 h-10 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="currentColor"/>
                    <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="currentColor"/>
                    <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="currentColor"/>
                  </svg>
                  <span className="hidden sm:inline-block ml-2">LinkedIn</span>
                </a>

                <a href="https://medium.com/@sedsantariksh" target="_blank" rel="noopener noreferrer" aria-label="Medium" className="group inline-flex items-center justify-center flex-1 px-3 py-3 rounded-lg border border-white/10 bg-black/20 text-white/90 text-sm font-medium hover:scale-105 transition-all duration-200">
                  <svg className="w-10 h-10 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M13 12C13 15.3137 10.3137 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C10.3137 6 13 8.68629 13 12Z" fill="currentColor"/>
                    <path d="M23 12C23 14.7614 22.5523 17 22 17C21.4477 17 21 14.7614 21 12C21 9.23858 21.4477 7 22 7C22.5523 7 23 9.23858 23 12Z" fill="currentColor"/>
                    <path d="M17 18C18.6569 18 20 15.3137 20 12C20 8.68629 18.6569 6 17 6C15.3431 6 14 8.68629 14 12C14 15.3137 15.3431 18 17 18Z" fill="currentColor"/>
                  </svg>
                  <span className="hidden sm:inline-block ml-2">Medium</span>
                </a>

                <a href="https://www.youtube.com/@seds_antariksh" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="group inline-flex items-center justify-center flex-1 px-3 py-3 rounded-lg border border-white/10 bg-black/20 text-white/90 text-sm font-medium hover:scale-105 transition-all duration-200">
                  <svg className="w-10 h-10 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.49614 7.13176C9.18664 6.9549 8.80639 6.95617 8.49807 7.13509C8.18976 7.31401 8 7.64353 8 8V16C8 16.3565 8.18976 16.686 8.49807 16.8649C8.80639 17.0438 9.18664 17.0451 9.49614 16.8682L16.4961 12.8682C16.8077 12.6902 17 12.3589 17 12C17 11.6411 16.8077 11.3098 16.4961 11.1318L9.49614 7.13176ZM13.9844 12L10 14.2768V9.72318L13.9844 12Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 12C0 8.25027 0 6.3754 0.954915 5.06107C1.26331 4.6366 1.6366 4.26331 2.06107 3.95491C3.3754 3 5.25027 3 9 3H15C18.7497 3 20.6246 3 21.9389 3.95491C22.3634 4.26331 22.7367 4.6366 23.0451 5.06107C24 6.3754 24 8.25027 24 12C24 15.7497 24 17.6246 23.0451 18.9389C22.7367 19.3634 22.3634 19.7367 21.9389 20.0451C20.6246 21 18.7497 21 15 21H9C5.25027 21 3.3754 21 2.06107 20.0451C1.6366 19.7367 1.26331 19.3634 0.954915 18.9389C0 17.6246 0 15.7497 0 12ZM9 5H15C16.9194 5 18.1983 5.00275 19.1673 5.10773C20.0989 5.20866 20.504 5.38448 20.7634 5.57295C21.018 5.75799 21.242 5.98196 21.4271 6.23664C21.6155 6.49605 21.7913 6.90113 21.8923 7.83269C21.9973 8.80167 22 10.0806 22 12C22 13.9194 21.9973 15.1983 21.8923 16.1673C21.7913 17.0989 21.6155 17.504 21.4271 17.7634C21.242 18.018 21.018 18.242 20.7634 18.4271C20.504 18.6155 20.0989 18.7913 19.1673 18.8923C18.1983 18.9973 16.9194 19 15 19H9C7.08058 19 5.80167 18.9973 4.83269 18.8923C3.90113 18.7913 3.49605 18.6155 3.23664 18.4271C2.98196 18.242 2.75799 18.018 2.57295 17.7634C2.38448 17.504 2.20866 17.0989 2.10773 16.1673C2.00275 15.1983 2 13.9194 2 12C2 10.0806 2.00275 8.80167 2.10773 7.83269C2.20866 6.90113 2.38448 6.49605 2.57295 6.23664C2.75799 5.98196 2.98196 5.75799 3.23664 5.57295C3.49605 5.38448 3.90113 5.20866 4.83269 5.10773C5.80167 5.00275 7.08058 5 9 5Z" fill="currentColor"/>
                  </svg>
                  <span className="hidden sm:inline-block ml-2">Youtube</span>
                </a>
              </div>
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
                      <p className="text-white text-lg font-semibold">2021</p>
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
            camera={{ position: [100, 100, 0], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: true }}
            className="bg-black"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={10} />
            <Suspense fallback={null}>
              <MoonModel />
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas>
        )}
      </div>
    </div>
  );
}
