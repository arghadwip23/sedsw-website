"use client"
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Crown, Shield, User, Star, Users, Sparkles, Mail, Phone, BookOpen } from 'lucide-react';

// Types
type OrgRole = "president" | "vice-president" | "secretary" | "treasurer" | "member";
type DeptRole = "lead" | "co-lead" | "member";

interface IUser {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  branch: string;
  orgRole: OrgRole;
  department: {
    name: string;
    role: DeptRole;
    isInRole: boolean;
  };
  isAdmin: boolean;
  profilePicture?: string;
  password: string;
}

const SpaceTeamPage = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stars: THREE.Points;
    shapes: THREE.Mesh[];
  } | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [teamData, setTeamData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchTeamData = async () => {
    try {
      const response = await fetch("/api/getuser");
      const result = await response.json();

      if (result.success) {
        setTeamData(result.data);
      } else {
        console.error("API Error:", result.error || result.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching team data:", error);
      setLoading(false);
    }
  };

  fetchTeamData();
}, []);
  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Monochrome starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2500;
      positions[i3 + 1] = (Math.random() - 0.5) * 2500;
      positions[i3 + 2] = (Math.random() - 0.5) * 1500;
      sizes[i] = Math.random() * 2 + 1;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: false
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
      const geometry = Math.random() > 0.5 
        ? new THREE.BoxGeometry(2, 2, 2)
        : new THREE.SphereGeometry(1, 16, 16);
      
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
      
      shape.userData = {
        originalPosition: shape.position.clone(),
        rotationSpeed: Math.random() * 0.02 + 0.005,
        floatSpeed: Math.random() * 0.5 + 0.2
      };
      
      scene.add(shape);
      shapes.push(shape);
    }

    camera.position.z = 50;
    sceneRef.current = { scene, camera, renderer, stars, shapes };

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      const mouse = mouseRef.current;
      
      // Camera parallax
      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 8 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      
      // Animate stars
      stars.rotation.y += 0.0003;
      stars.rotation.x += mouse.x * 0.0001;
      
      // Animate shapes
      shapes.forEach((shape, index) => {
        const data = shape.userData;
        shape.position.y = data.originalPosition.y + Math.sin(time * data.floatSpeed + index) * 3;
        shape.rotation.x += data.rotationSpeed;
        shape.rotation.y += data.rotationSpeed * 0.7;
        shape.position.x += mouse.x * 1;
        shape.position.y += mouse.y * 1;
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (sceneRef.current) {
        const { camera, renderer } = sceneRef.current;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Helper functions
  const getOrgRoleIcon = (role: OrgRole) => {
    switch (role) {
      case 'president': return <Crown className="w-6 h-6" />;
      case 'vice-president': return <Shield className="w-6 h-6" />;
      case 'secretary': return <BookOpen className="w-6 h-6" />;
      case 'treasurer': return <Star className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getDeptRoleIcon = (role: DeptRole) => {
    switch (role) {
      case 'lead': return <Sparkles className="w-5 h-5" />;
      case 'co-lead': return <Users className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getOrgRolePriority = (role: OrgRole): number => {
    const priorities = {
      'president': 1,
      'vice-president': 2,
      'secretary': 3,
      'treasurer': 4,
      'member': 5
    };
    return priorities[role];
  };

  const getDeptRolePriority = (role: DeptRole): number => {
    const priorities = {
      'lead': 1,
      'co-lead': 2,
      'member': 3
    };
    return priorities[role];
  };

  // Sort team data by hierarchy
  const sortedTeamData = [...teamData].sort((a, b) => {
    const orgPriorityA = getOrgRolePriority(a.orgRole);
    const orgPriorityB = getOrgRolePriority(b.orgRole);
    
    if (orgPriorityA !== orgPriorityB) {
      return orgPriorityA - orgPriorityB;
    }
    
    const deptPriorityA = getDeptRolePriority(a.department.role);
    const deptPriorityB = getDeptRolePriority(b.department.role);
    
    return deptPriorityA - deptPriorityB;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-gray-800 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-gray-700 border-b-gray-300 rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          <p className="text-2xl font-light text-white tracking-wider">
            Loading Team Constellation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 z-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        
        {/* Header Section */}
        <header className="bg-black text-center py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="inline-block p-4 border-2 border-white/20 rounded-full mb-6 backdrop-blur-sm bg-black/20">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-thin mb-6 tracking-wider">
              SPACE <span className="font-light">TEAM</span>
            </h1>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
            
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the cosmic crew navigating through the infinite possibilities of space exploration and technology
            </p>
            
            <div className="mt-12 flex justify-center">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Team Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedTeamData.map((member, index) => (
                <div
                  key={member.registrationNumber}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Background */}
                  <div className="absolute -inset-px bg-gradient-to-br from-white/20 via-transparent to-white/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300 hover:border-white/30">
                    
                    {/* Profile Picture */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300">
                        {member.profilePicture ? (
                          <img
                            src={member.profilePicture}
                            alt={member.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Role Badge */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-black border border-white/20 rounded-full p-2">
                          {getOrgRoleIcon(member.orgRole)}
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <h3 className="text-xl font-light mb-2 tracking-wide">{member.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{member.registrationNumber}</p>
                    <p className="text-sm text-gray-500 mb-4">{member.branch}</p>
                    
                    {/* Organization Role */}
                    <div className="mb-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        {getOrgRoleIcon(member.orgRole)}
                        <span className="text-xs uppercase tracking-wider font-light">
                          {member.orgRole.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Department Role */}
                    {member.department.isInRole && (
                      <div className="mb-4">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                          {getDeptRoleIcon(member.department.role)}
                          <span>{member.department.role.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>{member.department.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{member.phoneNumber}</span>
                      </div>
                    </div>

                    {/* Admin Badge */}
                    {member.isAdmin && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-16 px-4">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8"></div>
          <p className="text-sm text-gray-500 font-light tracking-wider">
            EXPLORING THE COSMOS TOGETHER
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SpaceTeamPage;