/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import SpotlightCard from "../../../Components/SpotlightCard/SpotlightCard";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface Event {
  _id: string;
  eventName: string;
  location: string;
  date: string;
  category: string;
  thumbnail?: string;
}

function Stars({ count }: { count: number }) {
  const starGeometry = useRef<THREE.BufferGeometry>(null);
  const starMaterial = useRef<THREE.PointsMaterial>(null);
  const stars = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [starPositions, starColors] = useMemo(() => {
    const positions = [];
    const colors = [];
    const marsPosition = [70, 0, 30]; // Match Mars model position
    const radius = 200; // Larger radius to encompass Mars

    for (let i = 0; i < count; i++) {
      // Use spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // Convert spherical to cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta) + marsPosition[0];
      const y = radius * Math.sin(phi) * Math.sin(theta) + marsPosition[1];
      const z = radius * Math.cos(phi) + marsPosition[2];

      positions.push(x, y, z);

      const color = new THREE.Color();
      color.setStyle("white"); // Stick to white stars for better visibility
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
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
    }

    if (!stars.current) {
      stars.current = new THREE.Points(
        starGeometry.current,
        starMaterial.current
      );
    }

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [starColors, starPositions]);

  useFrame(() => {
    if (stars.current) {
      // Match Mars rotation pattern
      stars.current.rotation.y = THREE.MathUtils.lerp(
        stars.current.rotation.y,
        mousePosition.y * 0.2,
        0.1
      );
      stars.current.rotation.x = THREE.MathUtils.lerp(
        stars.current.rotation.x,
        -mousePosition.x * 0.1 + Math.PI / 2,
        0.1
      );
    }
  });

  return stars.current ? <primitive object={stars.current} /> : null;
}

function MoonModel() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/mars.glb");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.y * 0.2 + Math.PI / 6,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mousePosition.x * 0.1 + Math.PI / 2,
        0.1
      );
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={60}
      position={[70, 0, 30]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events/list");
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

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
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative">
      {/* 3D Moon + Stars Background */}
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999] bg-black">
        {isClient && (
          <Canvas
            camera={{ position: [100, 100, 0], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: true }}
            className="absolute inset-0"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[-1000, 200, 150]} intensity={10} />
            <Suspense fallback={null}>
              <MoonModel />
              <Stars count={500} />
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas>
        )}
      </div>

      {/* Events Section */}
      <div className="flex flex-col z-2 -mt-30">
        <h1 className="text-3xl font-bold text-white md:mb-16 md:pr-36 md:text-left md:pl-24 text-center mb-8">
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
            <div
              style={{ minWidth: 24, maxWidth: 24, pointerEvents: "none" }}
              aria-hidden="true"
            />

            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className="snap-center flex-shrink-0"
                  style={{ minWidth: 320, maxWidth: 340 }}
                >
                  <Link href={`/events/${event._id}`}>
                    <SpotlightCard
                      className="custom-spotlight-card w-full rounded-xl"
                      spotlightColor="rgba(255, 255, 255, 0.4)"
                    >
                      <div className="flex flex-col gap-2 p-4">
                        <h2 className="text-white text-xl font-bold">
                          {event.eventName}
                        </h2>
                        <div className="w-full h-px bg-white/20 my-2" />
                        <p className="text-sm text-gray-300">
                          <span>{event.location}</span>
                        </p>
                        <p className="text-sm text-gray-300">
                          <span>{event.date}</span>
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="font-semibold">
                            {event.category}
                          </span>
                        </p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-white">No events available</p>
            )}

            <div
              style={{ minWidth: 24, maxWidth: 24, pointerEvents: "none" }}
              aria-hidden="true"
            />
          </div>
          {/* Thin scroll indicator */}
          <div className="absolute left-1/4 right-1/4 bottom-14 h-1 bg-white/10 rounded-full pointer-events-none overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full transition-all duration-200 absolute"
              style={{
                width: `${(scrollIndicator.width / (scrollRef.current?.clientWidth || 1)) *
                  100
                  }%`,
                left: `${(scrollIndicator.left / (scrollRef.current?.clientWidth || 1)) *
                  100
                  }%`,
              }}
            />
          </div>
          <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-4 z-20">
            <button
              aria-label="Scroll left"
              className={`p-2 transition
                ${canScrollLeft
                  ? "transparent text-white hover:bg-white hover:text-black"
                  : "text-gray-400 cursor-not-allowed"
                }
              `}
              onClick={() => scrollByCards("left")}
              disabled={!canScrollLeft}
            >
              &#8592;
            </button>
            <button
              aria-label="Scroll right"
              className={`p-2 transition
                ${canScrollRight
                  ? "transparent text-white hover:bg-white hover:text-black"
                  : " text-gray-400 cursor-not-allowed"
                }
              `}
              onClick={() => scrollByCards("right")}
              disabled={!canScrollRight}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>

      {/* Next Page Button */}
      <Link
        href="/team"
        className="fixed bottom-8 right-8 z-30 px-6 py-3 backdrop-blur-xl text-white border-2 rounded-lg border-white/30 font-semibold shadow-lg transition-all duration-300 ease-out
          hover:bg-white hover:text-black group flex items-center gap-2 active:scale-95"
      >
        <span>Next Page</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          &#8594;
        </span>
      </Link>
    </div>
  );
}
