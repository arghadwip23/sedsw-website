"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import BlurText from "../../../TextAnimations/BlurText/BlurText";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//import AnimatedContent from "../../../Animations/AnimatedContent/AnimatedContent";
//import { supabase } from "../../../lib/supabaseClient"; // adjust path as needed
//instead of supabase send request to internal route
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Application } from "@/types/Application";


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
      galaxy.scale.set(3, 3, 3);

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
      className="fixed top-0 left-0 w-full h-screen z-0"
      style={{ pointerEvents: "none" }}
    />
  );
};

const Join = () => {

const initialFormData: Application = {
  fullName: "",
  registrationNumber: "",
  email: "",
  phone: "",
  primaryDepartment: "",
  secondaryDepartment: "",
  motivation: "", // "Why do you want to join SEDS?"
};

  const [formData, setFormData] = useState<Application>(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading,setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // Check URL parameters on component mount and when URL changes
  useEffect(() => {
    const checkUrlParams = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const verified = urlParams.get('verified');
        const error = urlParams.get('error');
        
        console.log("URL params - verified:", verified, "error:", error);
        console.log("Current URL:", window.location.href);
        
        if (verified === '1') {
          console.log("Setting showThankYou to true");
          setShowThankYou(true);
          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (verified === '0' && error) {
          // Handle verification errors
          let errorMsg = "Verification failed. ";
          switch (error) {
            case 'no_token':
              errorMsg += "No verification token provided.";
              break;
            case 'invalid_token':
              errorMsg += "Invalid or expired verification token.";
              break;
            case 'duplicate':
              errorMsg += "Registration number already exists.";
              break;
            case 'server_error':
              errorMsg += "Server error occurred during verification.";
              break;
            default:
              errorMsg += "Unknown error occurred.";
          }
          setVerificationError(errorMsg);
          console.error(errorMsg);
        }
      }
    };

    // Check on mount
    checkUrlParams();

    // Listen for URL changes (for when verification redirects back)
    const handleUrlChange = () => {
      console.log("URL changed, checking params again");
      checkUrlParams();
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Also check when the component is focused (in case verification opened in new tab)
    const handleFocus = () => {
      console.log("Window focused, checking params");
      checkUrlParams();
      // Also check cross-tab signal via localStorage flag
      try {
        if (localStorage.getItem('seds_verified') === '1') {
          setShowThankYou(true);
          localStorage.removeItem('seds_verified');
        }
      } catch (e) {console.log(e);
      }
    };
    
    window.addEventListener('focus', handleFocus);

    // Listen via BroadcastChannel for cross-tab verification
    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('seds_verification');
        bc.onmessage = (ev) => {
          if (ev?.data?.verified) {
            setShowThankYou(true);
          }
        };
      }
    } catch {
      // Ignore BroadcastChannel errors
    }

    // Listen to storage events (in case BroadcastChannel is unavailable)
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'seds_verified' && ev.newValue === '1') {
        setShowThankYou(true);
        try { localStorage.removeItem('seds_verified'); } catch {
          // Ignore localStorage errors
        }
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', onStorage);
      if (bc) {
        try { bc.close(); } catch {
          // Ignore close errors
        }
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBackToMain = () => {
    setShowForm(false);
    setVerificationSent(false);
    setVerificationError("");
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setLoading(true);
    // Clear previous banners so only the latest shows
    setVerificationSent(false);
    setVerificationError("");
    setErrorMessage("");
    setDeptError("");
    setRegError("");
    
    if (formData.primaryDepartment === formData.secondaryDepartment) {
      setDeptError("Primary and secondary department preferences must be different.");
      setVerificationSent(false);
      setLoading(false);
      return;
    }
    
    try {
      console.log("Submitting form data:", formData);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        setErrorMessage("");
        setVerificationError("");
        setDeptError("");
        setRegError("");
        setFormData(initialFormData); // reset form
        setShowThankYou(true);
      } else {
        setVerificationSent(false);
        if (res.status === 400 && data.message && data.message.toLowerCase().includes('registration number already exists')) {
          // Show inline under registration number instead of top banner
          setRegError("Registration number already registered");
        } else {
          setErrorMessage(`❌ Failed: ${data.message || "Something went wrong"}`);
        }
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setVerificationSent(false);
      setErrorMessage("❌ Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  //const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDepartments, setShowDepartments] = useState(false); // Mounted
  const [departmentsVisible, setDepartmentsVisible] = useState(false); // Animated visibility
  const departmentRef = useRef<HTMLDivElement>(null);
  const [deptError, setDeptError] = useState("");
  const [regError, setRegError] = useState("");

  const scrollToDepartments = () => {
    setShowDepartments(true);
    setTimeout(() => {
      setDepartmentsVisible(true);
      departmentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // slight delay for smoother scroll
  };
  
  useEffect(() => {
    
    if (showDepartments && departmentRef.current) {
      departmentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDepartments]);
  
  const scrollToTop = () => {
    // Immediately scroll up a bit to trigger a proper visual transition
    window.scrollBy({ top: -100, behavior: 'smooth' });
  
    // Then collapse after slight delay
    setTimeout(() => {
      setDepartmentsVisible(false); // triggers exit animation
    }, 100); // let the scroll happen slightly first
  
    setTimeout(() => {
      setShowDepartments(false); // unmount AFTER animation
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000); // match animation + scroll time
  };
  

  if (showThankYou) {
    return (
      <div className="relative w-full h-screen bg-transparent backdrop-blur-lg flex items-center justify-center">
        <GalaxyBackground />
        <div className="flex flex-col items-center justify-center text-center px-6 -mt-25">
          <BlurText
            text="Thank You!"
            delay={10}
            animateBy="words"
            direction="top"
            className="text-6xl font-bold text-white mb-8"
          />
          <BlurText
            text="Your application has been submitted successfully!"
            delay={50}
            animateBy="words"
            direction="top"
            className="text-xl text-white/90 max-w-2xl mb-12"
          />
          <BlurText
            text="Our team will reach out to you during our recruitment season."
            delay={50}
            animateBy="words"
            direction="top"
            className="text-xl text-white/90 max-w-2xl mb-12 -mt-12"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="h-14 border border-white bg-white text-black font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-105 active:scale-95 px-8"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex items-center bg-black justify-center">
      <GalaxyBackground />
      

      {!showForm ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 md:px-16">
          <div className="max-w-4xl w-full text-center">
            <div className="backdrop-blur-xl bg-transparent rounded-3xl p-8 md:p-12 mb-12">
              <BlurText
                text="Join Us"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-5xl md:text-6xl font-bold text-white mb-8"
              />
              
              <BlurText
                text="From hands-on technical projects to thought-provoking space talks and outreach initiatives, we aim to foster curiosity and inspire the next generation of changemakers. Whether you're a beginner or an experienced space nerd, there's always a place for you here. Ready to launch your journey with us? Fill up the details below and our team will reach out to you."
                delay={20}
                animateBy="words"
                direction="top"
                className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-3xl mx-auto"
              />
              <div className="flex md:justify-left md:pl-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="h-16 px-8 border border-white bg-black text-white font-semibold text-xl transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          {!showDepartments && (
  <div className="absolute bottom-30 w-full flex flex-col items-center z-50 space-y-2">
    {/* Text Label */}
    <span className="text-white/70 text-sm md:text-base animate-pulse">
      Discover our departments
    </span>

    {/* Down Arrow Button */}
    <button
      onClick={scrollToDepartments}
      className="animate-bounce focus:outline-none"
      aria-label="Show Departments"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
)}

<AnimatePresence>
{showDepartments && (
    <motion.div
      key="departments"
      initial={{ opacity: 0, y: 50 }}
      animate={departmentsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: .5, ease: "easeInOut" }}
      ref={departmentRef}
      className="absolute bottom-0 left-0 right-0 w-full text-white px-4 md:px-6 py-6 backdrop-blur-xl bg-black/40 border-t border-white/20 max-h-[75vh] overflow-y-auto"
    >
      {/* Top Up Arrow */}
      <div className="w-full flex justify-center mb-6">
        <button
          onClick={scrollToTop}
          className="animate-bounce focus:outline-none"
          aria-label="Hide Departments"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white rotate-180 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {/* Projects Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={departmentsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="group relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-xl p-5 hover:bg-black/30 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">Projects</h3>
          </div>
          <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
            The Projects team brings innovation to life. Here, members get the opportunity to work on real-world, space-related projects — from building models and simulations to designing space-tech concepts. It&apos;s a space to explore, experiment, and turn ideas into impactful solutions.
          </p>
          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

        {/* Events Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={departmentsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-xl p-5 hover:bg-black/30 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">Events</h3>
          </div>
          <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
            The Events team keeps the SEDS spirit alive! From magical stargazing nights to challenging hackathons and hands-on workshops, they are the ones behind every unforgettable experience. They plan, organize, and execute events that bring together and build a strong community.
          </p>
          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

        {/* Design & Content Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={departmentsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="group relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-xl p-5 hover:bg-black/30 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">Design & Content</h3>
          </div>
          <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
            The Content & Design team tells the SEDS story in the most creative ways possible. Whether it&apos;s writing compelling blogs, crafting engaging social media posts, producing YouTube videos, or designing eye-catching visuals, we turn ideas into captivating content.
          </p>
          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

        {/* Outreach Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={departmentsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="group relative backdrop-blur-xl bg-black/20 border border-white/20 rounded-xl p-5 hover:bg-black/30 hover:border-white/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">Outreach</h3>
          </div>
          <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 text-sm">
            The Outreach team is the heart of our mission. Spreading awareness and igniting curiosity about space in young minds of India. We organize both offline and online initiatives that engage diverse communities, from school visits and public talks to social media campaigns.
          </p>
          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


        </div>
      ) : (
        <div className="relative z-10 w-full h-full flex items-center justify-center px-6 -mt-10">
          <div className="w-full max-w-4xl">
            {/* Back Button above the form */}
            <div className="flex justify-start pt-24 pb-0">
              <button
                onClick={handleBackToMain}
                className="flex items-center text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm md:text-base">Back</span>
              </button>
            </div>
            <div className="pt-4">
    {verificationSent && (
      <div className="mb-4 text-green-400 text-center font-medium p-4 bg-green-500/20 border border-green-500/50 rounded-md">
        ✅ Thank You 
        
      </div>
    )}
    
    {verificationError && (
      <div className="mb-4 text-red-400 text-center font-medium p-4 bg-red-500/20 border border-red-500/50 rounded-md">
        ❌ {verificationError}
      </div>
    )}

    {errorMessage && (
      <div className="mb-4 text-red-400 text-center font-medium p-4 bg-red-500/20 border border-red-500/50 rounded-md">
        ❌ {errorMessage}
      </div>
    )}
    
    {/* {showAlreadyRegistered && (
      <div className="text-red-400 text-center mb-4 font-medium">
        You are already registered.
      </div>
    )} */}
    
          <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6 backdrop-blur-md bg-black/60 md:bg-transparent p-6  rounded-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your registration number"
                  />
                  {regError && (
                    <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                      {regError}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Primary Department Preference *</label>
                <select
                  name="primaryDepartment"
                  required
                  value={formData.primaryDepartment}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                >
                  <option value="" disabled>Select your preferred department</option>
                  <option value="project">Projects</option>
                  <option value="event">Events</option>
                  <option value="content">Design & Content</option>
                  <option value="outreach">Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Secondary Department Preference *</label>
                <select
                  name="secondaryDepartment"
                  required
                  value={formData.secondaryDepartment}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                >
                  <option value="" disabled>Select your preferred department</option>
                  <option value="project">Projects</option>
                  <option value="event">Events</option>
                  <option value="content">Design & Content</option>
                  <option value="outreach">Outreach</option>
                </select>
                {deptError && (
                  <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                    {deptError}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Why do you want to join SEDS? *</label>
                <textarea
                  name="motivation"
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors resize-none"
                  placeholder="Tell us about your interest in space exploration, your goals, and what you hope to achieve by joining SEDS Antariksh..."
                ></textarea>
              </div>
              
              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="mt-6 h-14 border border-white bg-black text-white font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 w-full md:w-48"
                 disabled={loading}>
                  {loading?"Submitting...":"Submit Application"}
                </button>
              </div>
            </form>
            </div>
          </div>
          </div>
        )}
      </div>
      
    );
  };
  
  export default Join;
