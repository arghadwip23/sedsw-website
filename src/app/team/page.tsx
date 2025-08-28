"use client"
import React, { useEffect, useState } from 'react';
import { Crown, Shield, User, Star, Users, Sparkles, Mail, Phone, BookOpen } from 'lucide-react';
import Galaxy from '../../../Backgrounds/Galaxy/Galaxy';

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
    <div className="relative min-h-screen bg-transparent text-white overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        
        {/* Header Section */}
        <header className="bg-transparent text-center py-20 px-4">
                <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.5}
          saturation={.5}
          repulsionStrength={.2}
          hueShift={200}
        />
      </div>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="inline-block p-4 border-2 border-white/20 rounded-full mb-6 backdrop-blur-sm bg-black/20">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-thin mb-6 tracking-wider z-10">
              SPACE <span className="font-light">TEAM</span>
            </h1>
            
            <div className="w-32 h-px mx-auto mb-8"></div>
            
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