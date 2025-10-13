/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from 'react';
import { Crown, Shield, User, Star, Users, Sparkles, Mail, Phone, BookOpen } from 'lucide-react';
import Galaxy from '../../../Backgrounds/Galaxy/Galaxy';

// Types
type OrgRole =
  | "chairperson"
  | "vice chairperson"
  | "general secretary"
  | "treasurer"
  | "lead"
  | "deputy lead"
  | "member";

interface IUser {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  branch?: string;
  orgRole: OrgRole;
  department: string;
  isCoreCommittee: boolean;
  verifiedByPresident: boolean;
  isAdmin: boolean;
  profilePicture?: string;
  password: string;
}

const SpaceTeamPage = () => {
  const [teamData, setTeamData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(false);

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
      case 'chairperson': return <Crown className="w-4 h-4" />;
      case 'vice chairperson': return <Shield className="w-4 h-4" />;
      case 'general secretary': return <BookOpen className="w-4 h-4" />;
      case 'treasurer': return <Star className="w-4 h-4" />;
      case 'lead': return <Sparkles className="w-4 h-4" />;
      case 'deputy lead': return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  // Helper for department role icon
  // const getDeptRoleIcon = (role: string) => {
  //   switch (role.toLowerCase()) {
  //     case 'lead': return <Sparkles className="w-4 h-4" />;
  //     case 'deputy lead': return <Users className="w-4 h-4" />;
  //     case 'member': return <User className="w-4 h-4" />;
  //     default: return <User className="w-4 h-4" />;
  //   }
  // };

  const getOrgRolePriority = (role: OrgRole): number => {
    const priorities: Record<OrgRole, number> = {
      'chairperson': 1,
      'vice chairperson': 2,
      'general secretary': 3,
      'treasurer': 4,
      'lead': 5,
      'deputy lead': 6,
      'member': 7
    };
    return priorities[role];
  };

  // Department order priority
  const getDepartmentPriority = (dept: string): number => {
    const priorities: Record<string, number> = {
      'Executive': 1,
      'project': 2,
      'events': 3,
      'outreach': 4,
      'design': 5
    };
    return priorities[dept] || 99; // Default priority for unknown departments
  };

  // Filter and sort team data
  const filterAndSortTeamData = () => {
    // Filter out regular members if showAllMembers is false
    let filteredData = [...teamData];
    if (!showAllMembers) {
      filteredData = filteredData.filter(member =>
        member.orgRole !== 'member' ||
        ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(member.orgRole)
      );
    }

    // Sort by department priority, then by org role priority
    return filteredData.sort((a, b) => {
      const deptPriorityA = getDepartmentPriority(a.department);
      const deptPriorityB = getDepartmentPriority(b.department);

      if (deptPriorityA !== deptPriorityB) {
        return deptPriorityA - deptPriorityB;
      }

      const orgPriorityA = getOrgRolePriority(a.orgRole);
      const orgPriorityB = getOrgRolePriority(b.orgRole);
      return orgPriorityA - orgPriorityB;
    });
  };

  const sortedTeamData = filterAndSortTeamData();

  // Group team members by department
  const groupedByDepartment = sortedTeamData.reduce((acc, member) => {
    const dept = member.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, IUser[]>);

  // Get departments in priority order
  const orderedDepartments = Object.keys(groupedByDepartment).sort(
    (a, b) => getDepartmentPriority(a) - getDepartmentPriority(b)
  );

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
            Loading Team Constellation
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

        {/* Departments Sections */}
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {orderedDepartments.map((department) => (
              <section key={department} className="mb-20">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl font-thin mb-4 capitalize tracking-wider">
                    {department === "Executive" ? "Executive Committee" : `${department} Department`}
                  </h2>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {groupedByDepartment[department].map((member, index) => (
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
                          <div className="w-38 h-38 mx-auto rounded-md overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300">
                            {member.profilePicture ? (
                              <img
                                src={member.profilePicture}
                                alt={member.name}
                                className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Role Badge */}
                          {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="bg-black border border-white/20 rounded-full p-2">
                              {getOrgRoleIcon(member.orgRole)}
                            </div>
                          </div> */}
                        </div>

                        {/* Member Info */}
                        <h3 className="text-xl font-light mb-2 tracking-wide">{member.name}</h3>

                        {/* Organization Role */}
                        <div className="mb-4">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            {getOrgRoleIcon(member.orgRole)}
                            <span className="text-xs uppercase tracking-wider font-light">
                              {member.orgRole.replace('-', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          {/* <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{member.phoneNumber}</span>
                          </div> */}
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
              </section>
            ))}

            {/* View All Members Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 text-white font-light tracking-wide"
              >
                {showAllMembers ? "Hide Regular Members" : "View All Members"}
              </button>
            </div>
          </div>
        </div>

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