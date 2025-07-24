"use client"

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import BlurText from "../../../TextAnimations/BlurText/BlurText";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, galaxy: THREE.Object3D, galaxyGroup: THREE.Group, frameId: number;

    const mount = mountRef.current;
    if (!mount) return;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    // Move camera up and back, then look at the origin for a 45 degree angle
    camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 6); // y=3 is higher, z=6 is back
    camera.lookAt(0, 0, 0);      // look at the center of the galaxy

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.2);
    scene.add(hemiLight);

    galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const loader = new GLTFLoader();
    loader.load(
      "/models/galaxy.glb",
      (gltf) => {
        galaxy = gltf.scene;
        galaxy.scale.set(2, 2, 2);

        // Center the galaxy model
        const box = new THREE.Box3().setFromObject(galaxy);
        const center = new THREE.Vector3();
        box.getCenter(center);
        galaxy.position.sub(center); // Move the center to (0,0,0)

        galaxyGroup.add(galaxy); // Add to group at origin
      }
    );

    const animate = () => {
      if (galaxyGroup) {
        galaxyGroup.rotation.y += 0.002; // rotate the group, not the mesh
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
      if (renderer && renderer.domElement && mount) mount.removeChild(renderer.domElement);
      renderer?.dispose();
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
    <div className="relative w-full h-screen flex items-center justify-center">
      <GalaxyBackground />
      <div className="z-10 flex flex-col md:items-start items-center md:justify-center justify-start absolute left-0 top-0 h-full w-full md:w-1/2 px-6 md:px-16 pt-24">
        <BlurText
          text="Join Us"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl font-bold mb-8"
          />
        <div className="text-xl mb-6">
          Lorem ipsum, dolor sit amet coasectetur adipisicing elit. Neque ullam illo possimus qui numquam veritatis ad iure ipsum dignissimos quos officiis eius natus vel quas ipsa corporis, odit autem nulla?
        </div>
        <div className="w-full">
          <textarea
            className="w-full md:w-[32rem] h-64 p-4 bg-transparent backdrop-blur-md text-white mt-4 rounded-lg border border-white resize-none"
            style={{ minWidth: "0" }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Join