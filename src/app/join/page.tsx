"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import BlurText from "../../../TextAnimations/BlurText/BlurText";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import AnimatedContent from "../../../Animations/AnimatedContent/AnimatedContent";

const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  let galaxy: THREE.Object3D | null = null;
  let frameId: number;

  const mount = mountRef.current;
  if (!mount) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.2);
  scene.add(hemiLight);

  const galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  const loader = new GLTFLoader();
  loader.load(
    "/models/galaxy.glb",
    (gltf) => {
      galaxy = gltf.scene;
      galaxy.scale.set(2, 2, 2);

      const box = new THREE.Box3().setFromObject(galaxy);
      const center = new THREE.Vector3();
      box.getCenter(center);
      galaxy.position.sub(center);

      galaxyGroup.add(galaxy);
    },
    undefined,
    (error) => {
      console.error("Error loading GLTF:", error);
    }
  );

  const animate = () => {
    if (galaxyGroup) {
      galaxyGroup.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  animate();

  const handleResize = () => {
    if (!mount) return;
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    if (frameId) cancelAnimationFrame(frameId);
    if (renderer && renderer.domElement && mount.contains(renderer.domElement)) {
      mount.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
}, []);


  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-screen -z-[9999]"
      style={{ pointerEvents: "none" }}
    />
  );
};

const Join = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black/40">
      <GalaxyBackground />
      <div className="flex flex-col md:justify-center justify-start absolute left-0 top-16 md:top-0 h-full w-full md:w-1/2 px-6 md:px-16 pt-24">
        <BlurText
          text="Join Us"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl font-bold mb-8"
        />
        <BlurText
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          delay={20}
          animateBy="words"
          direction="top"
          className="text-xl mb-8"
        />
        <div className="w-full">
          <AnimatedContent
            distance={300}
            direction="vertical"
            reverse={false}
            duration={1}
            ease="power3.out"
            initialOpacity={1.0}
            animateOpacity
            scale={1.1}
            delay={0.3}
          >
            <textarea
              className="w-full md:w-[60rem] h-64 p-4 backdrop-blur-md bg-black/60 md:bg-transparent text-white mt-4 border border-white resize-none"
              placeholder="Type your message here..."
            ></textarea>
            <div className="flex w-full md:w-[32rem] justify-center md:justify-start">
              <button
                className="mt-6 h-14 border border-white bg-black text-white font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 w-full md:w-48"
              >
                Send
              </button>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default Join;
