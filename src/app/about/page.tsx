"use client";

import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function About() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, moon: THREE.Object3D, frameId: number;
    let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;

    const mount = mountRef.current;
    if (!mount) return;

    // Initialize Three.js
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 100;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    // Load moon model
    const loader = new GLTFLoader();
    loader.load(
      "/models/moon2.glb",
      (gltf) => {
        moon = gltf.scene;
        
        // Fix materials and normals
        moon.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            if (child.material.normalMap) {
              child.material.normalScale.set(1, 1);
            }
          }
        });

        moon.scale.set(0.8, 0.8, 0.8);
        moon.position.set(0, -70, 0);
        scene.add(moon);
        setIsLoading(false);
      },
      (xhr) => {
        // Update loading progress
        setProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.error("Error loading moon model:", error);
        setIsLoading(false);
      }
    );

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = mouseX * 0.5;
      targetRotX = mouseY * 0.5;
    };
    mount.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      if (moon) {
        moon.rotation.y += (targetRotY - moon.rotation.y) * 0.05;
        moon.rotation.x += (targetRotX - moon.rotation.x) * 0.05;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      mount.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      if (mount && renderer?.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-lg">Loading Moon...</p>
          <p className="text-gray-400 text-sm mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      <div
        ref={mountRef}
        className="w-full h-screen fixed top-0 left-0 -z-[9999]"
      />
    </div>
  );
}