"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import BlurText from "../../../TextAnimations/BlurText/BlurText";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import AnimatedContent from "../../../Animations/AnimatedContent/AnimatedContent";
//import { supabase } from "../../../lib/supabaseClient"; // adjust path as needed
//instead of supabase send request to internal route
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



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
  const [formData, setFormData] = useState({
    full_name: "",
    registration_number: "",
    email: "",
    phone: "",
    department: "",
    department_2: "",
    why_join: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { registration_number, phone } = formData;
  
    // 1. Check for existing entry
    // const { data: existing, error: fetchError } = await supabase
    //   .from("applications")
    //   .select("*")
    //   .or(`registration_number.eq.${registration_number},phone.eq.${phone}`);
  
    // if (fetchError) {
    //   alert("Error checking existing data: " + fetchError.message);
    //   return;
    // }
    

    // 2. If a match is found, show already registered message
  
    // if (existing.length > 0) {
    //   const regUsed = existing.some(
    //     (row) => row.registration_number === registration_number
    //   );
    //   const phoneUsed = existing.some((row) => row.phone === phone);
      
    
    //   if (regUsed && phoneUsed) {
    //     setShowAlreadyRegistered(true);
    //   } else if (regUsed) {
    //     setShowAlreadyRegistered(true);
    //   } else if (phoneUsed) {
    //     setShowAlreadyRegistered(true);
    //   }
    //   return;
    // }
    if (formData.department === formData.department_2) {
      setErrorMessage("Primary and secondary department preferences must be different.");
      return;
    } else {
      setErrorMessage(""); // Clear error if valid
    }
    
    
    // 3. Otherwise, insert new data
//   const { error: insertError } = await supabase.from("applications").insert([
//   {
//     full_name: formData.full_name,
//     registration_number: formData.registration_number,
//     email: formData.email,
//     phone: formData.phone,
//     why_join: formData.why_join,
//     department: formData.department,
//     department_2: formData.department_2,
//   },
// ]);

// if (insertError) {
//   // Check if it's a unique constraint violation
//   if (
//     insertError?.message?.includes("duplicate key value") &&
//     insertError.message.includes("unique_registration_or_phone") ||
//     insertError.message.includes("unique_phone") ||
//     insertError.message.includes("unique_reg")
//   ) {
//     setShowAlreadyRegistered(true);
//   } else {
//     console.error("Insert failed:", insertError?.message || insertError || "Unknown error");

//   }
//   return;
// }
setShowThankYou(true);

  };
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const [showDepartments, setShowDepartments] = useState(false); // Mounted
  const [departmentsVisible, setDepartmentsVisible] = useState(false); // Animated visibility

  const departmentRef = useRef<HTMLDivElement>(null);

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
      <div className="relative w-full h-screen flex items-center justify-center bg-black/40">
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
    <div className="relative w-full h-screen flex items-center justify-center bg-black/40">
      <GalaxyBackground />
      

      {!showForm ? (
        <div className="flex flex-col items-center justify-start pt-35 h-full w-full px-6 md:px-16">
          <div className="max-w-4xl w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div className="flex-1">
                <BlurText
                  text="Join Us"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-5xl md:text-6xl font-bold text-white mb-6"
                />
                <BlurText
                  text="From hands-on technical projects to thought-provoking space talks and outreach initiatives, we aim to foster curiosity and inspire the next generation of changemakers. Whether you're a beginner or an experienced space nerd, there's always a place for you here. Ready to launch your journey with us? Fill up the details below and our team will reach out to you"
                  delay={20}
                  animateBy="words"
                  direction="top"
                  className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed"
                />
              </div>
              <div className="flex justify-center md:justify-end mt-8 md:mt-0 md:ml-12">
                <button
                  onClick={() => setShowForm(true)}
                  className="h-16 px-8 border border-white bg-black text-white font-semibold text-xl transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 mt-20"
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
      transition={{ duration: 1.2, ease: "easeInOut" }}
      ref={departmentRef}
      className="w-full text-white px-6 py-10 backdrop-blur-md border-t border-white/20"
      style={{ background: "transparent" }}
    >


    {/* Top Up Arrow */}
    <div className="w-full flex justify-center mb-8">
      <button
        onClick={scrollToTop}
        className="animate-bounce focus:outline-none"
        aria-label="Hide Departments"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white rotate-180 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

              {/* Department content stays same */}
              <div className="max-w-4xl mx-auto space-y-4 text-sm md:text-base leading-relaxed">
                <div>
                  <strong>🚀 Projects:<br/></strong> The Projects team brings innovation to life. Here, members get the opportunity to work on real-world, space-related projects — from building models and simulations to designing space-tech concepts. It's a space to explore, experiment, and turn ideas into impactful solutions. If you're someone who loves solving problems and thinking creatively, this is where your skills will shine.

                </div>
                <div>
                  <strong>🎉 Events:<br/></strong> The Events team keeps the SEDS spirit alive! From magical stargazing nights to challenging hackathons and hands-on workshops, they are the ones behind every unforgettable experience. They plan, organize, and execute events that bring together and build a strong community. If you enjoy bringing people together and creating memorable moments, Events is your home.

                </div>
                <div>
                  <strong>🎨 Design & Content:<br/></strong> The Content & Design team tells the SEDS story in the most creative ways possible. Whether it's writing compelling blogs, crafting engaging social media posts, producing YouTube videos, or designing eye-catching visuals, we turn ideas into captivating content. If you love expressing yourself through words, visuals, or videos, this team is your creative playground.
                </div>
                <div>
                  <strong>🌍 Outreach:<br/></strong> The Outreach team is the heart of our mission. Spreading awareness and igniting curiosity about space in young minds of India. We organize both offline and online initiatives that engage diverse communities, from school visits and public talks to social media campaigns and virtual events. If you’re passionate about making science accessible and inspiring the next generation of space enthusiasts, Outreach is the place for you.

                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>


        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center px-6 -mt-10">
            <button
            onClick={() => setShowForm(false)}
            className="absolute top-6 left-6 flex items-center text-white hover:text-gray-300 transition-colors z-50"
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
          
          <div className="w-full max-w-4xl">
          <div className="pt-20">
    {showAlreadyRegistered && (
      <div className="text-red-400 text-center mb-4 font-medium">
        You are already registered.
      </div>
    )}
    
          <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6 backdrop-blur-md bg-black/60 md:bg-transparent p-6  rounded-lg border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Registration Number *</label>
                  <input
                    type="text"
                    name="registration_number"
                    required
                    value={formData.registration_number}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter your registration number"
                  />
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
                  name="department"
                  required
                  value={formData.department}
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
                  name="department_2"
                  required
                  value={formData.department_2}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors"
                >
                  <option value="" disabled>Select your preferred department</option>
                  <option value="project">Projects</option>
                  <option value="event">Events</option>
                  <option value="content">Design & Content</option>
                  <option value="outreach">Outreach</option>
                </select>
                {errorMessage && (
                <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                  {errorMessage}
                </p>
              )}

              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Why do you want to join SEDS? *</label>
                <textarea
                  name="why_join"
                  required
                  rows={4}
                  value={formData.why_join}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/40 border border-white/30 text-white rounded-md focus:outline-none focus:border-white/60 transition-colors resize-none"
                  placeholder="Tell us about your interest in space exploration, your goals, and what you hope to achieve by joining SEDS Antariksh..."
                ></textarea>
              </div>
              
              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="mt-6 h-14 border border-white bg-black text-white font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 active:scale-95 w-full md:w-48"
                >
                  Submit Application
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
