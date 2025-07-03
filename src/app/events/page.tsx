"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect, Suspense } from "react";
import SpotlightCard from "../../../Components/SpotlightCard/SpotlightCard";
import { events } from "../../data/events";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from "three";

function MarsModel({ setProgress }: { setProgress: (p: number) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const gltf = useLoader(
    GLTFLoader,
    '/models/mars2.glb',
    (loader) => {
      loader.manager.onStart = () => setProgress(0);
      loader.manager.onProgress = (_, loaded, total) => {
        setProgress(Math.round((loaded / total) * 100));
      };
      loader.manager.onLoad = () => {
        setProgress(100);
        setModelLoaded(true);
      };
      loader.manager.onError = (url) => {
        console.error('Error loading model:', url);
      };
    }
  );

  // Spin the model around z axis
  useFrame(() => {
    if (meshRef.current && modelLoaded) {
      meshRef.current.rotation.z += 0.005;
    }
  });

  if (!modelLoaded) return null;

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={2.5}
      position={[0, 0, 0]}
    />
  );
}

export default function Events() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Clean up Three.js resources on unmount
  useEffect(() => {
    return () => {
      // Force cleanup of Three.js resources
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, []);

  // Hide loader when model is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        console.warn('Model loading timed out - falling back to static background');
        setIsLoading(false);
      }
    }, 45000); // Increased timeout to 15 seconds

    return () => clearTimeout(timer);
  }, [progress]);

  // Handle successful load
  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
    }
  }, [progress]);

  const scrollByCards = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
    scrollRef.current.scrollBy({
      left: dir === "right" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
  };

  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchScrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].clientX;
    const walk = touchStartX.current - x;
    scrollRef.current.scrollLeft = touchScrollLeft.current + walk;
  };

  const [scrollIndicator, setScrollIndicator] = useState({ width: 0, left: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const indicatorWidth = (clientWidth / scrollWidth) * clientWidth;
      const indicatorLeft = (scrollLeft / scrollWidth) * clientWidth;
      setScrollIndicator({
        width: isNaN(indicatorWidth) ? 0 : indicatorWidth,
        left: isNaN(indicatorLeft) ? 0 : indicatorLeft,
      });
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative z-0">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-lg">Loading Model...</p>
          <p className="text-gray-400 text-sm mt-2">
            {progress}%
          </p>
        </div>
      )}

      {/* Mars 3D Model Background with ref */}
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999]" ref={canvasRef}>
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true // Helps with context preservation
          }}
          onCreated={({ gl }) => {
            gl.getContext().canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.warn('WebGL context lost - attempting to recover');
            }, false);
          }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
            castShadow
          />
          <Suspense fallback={null}>
            <MarsModel setProgress={setProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Fallback in case model fails to load */}
      {!isLoading && progress < 100 && (
        <div className="absolute inset-0 -z-[9998] bg-black flex items-center justify-center">
          <p className="text-white">Could not load 3D model</p>
        </div>
      )}

      <div className="flex flex-col z-10 pt-16">
        <h1 className="text-3xl font-bold text-white md:mb-16 md:self-end md:pr-36 md:text-right text-center mb-8">
          Our Events
        </h1>
        <div className="relative w-full">
          {/* Card List */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto py-4 px-8 pb-24 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div style={{ minWidth: 24, maxWidth: 24, pointerEvents: "none" }} aria-hidden="true" />
            {events.map((event, idx) => (
              <div
                key={idx}
                className="snap-center flex-shrink-0"
                style={{ minWidth: 320, maxWidth: 340 }}
              >
                <SpotlightCard
                  className="custom-spotlight-card w-full"
                  spotlightColor="rgba(255, 255, 255, 0.4)"
                >
                  <div className="flex flex-col gap-2 p-4">
                    <h2 className="text-xl font-bold">{event.name}</h2>
                    <div className="w-full h-px bg-white/20 my-2" />
                    <p className="text-sm text-gray-300">
                      <span className="">{event.venue}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className=""> {event.dates}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">{event.theme}</span>
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            ))}
            <div style={{ minWidth: 24, maxWidth: 24, pointerEvents: "none" }} aria-hidden="true" />
          </div>
          {/* Thin scroll indicator */}
          <div className="absolute left-1/4 right-1/4 bottom-14 h-1 bg-white/10 rounded-full pointer-events-none overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full transition-all duration-200 absolute"
              style={{
                width: `${(scrollIndicator.width / (scrollRef.current?.clientWidth || 1)) * 100}%`,
                left: `${(scrollIndicator.left / (scrollRef.current?.clientWidth || 1)) * 100}%`,
              }}
            />
          </div>
          <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-4 z-20">
            <button
              aria-label="Scroll left"
              className={`p-2 transition
                ${canScrollLeft ? "transparent backdrop-blur-2xl text-white hover:bg-white hover:text-black" : "bg-black/20 text-gray-400 cursor-not-allowed"}
              `}
              onClick={() => scrollByCards("left")}
              style={{ pointerEvents: canScrollLeft && !isLoading ? "auto" : "none" }}
              disabled={!canScrollLeft}
            >
              &#8592;
            </button>
            <button
              aria-label="Scroll right"
              className={`p-2 transition
                ${canScrollRight ? "transparent backdrop-blur-2xl text-white hover:bg-white hover:text-black" : "bg-black/20 text-gray-400 cursor-not-allowed"}
              `}
              onClick={() => scrollByCards("right")}
              style={{ pointerEvents: canScrollRight && !isLoading ? "auto" : "none" }}
              disabled={!canScrollRight}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
      {/* Next Page Button */}
      <Link
        href="/projects"
        className="fixed bottom-8 right-8 z-30 px-6 py-3 bg-white text-black font-semibold shadow-lg transition-all duration-300 ease-out
          hover:bg-black hover:text-white hover:scale-105 group flex items-center gap-2 rounded-full"
      >
        <span>Next Page</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
      </Link>
    </div>
  );
}