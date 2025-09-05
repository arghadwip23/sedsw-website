/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw, Check, X, UserCheck, User, Star, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  branch?: string;
  orgRole: string;
  department: string;
  isCoreCommittee: boolean;
  verifiedByPresident: boolean;
  isAdmin: boolean;
  profilePicture?: string;
}

interface UserVerificationViewerProps {
  userRole: string;
  userDepartment: string;
  isAdmin: boolean;
}

export default function UserVerificationViewer({ userRole, userDepartment, isAdmin }: UserVerificationViewerProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    ['chairperson', 'vice chairperson', 'general secretary', 'treasurer'].includes(userRole) || isAdmin 
      ? 'all' 
      : userDepartment
  );
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  const isExecutive = ['chairperson', 'vice chairperson', 'general secretary', 'treasurer'].includes(userRole);
  const canSelectDepartment = isAdmin || isExecutive;
  
  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'project', label: 'Project' },
    { value: 'events', label: 'Events' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'design', label: 'Design' },
    { value: 'Executive', label: 'Executive' }
  ];

  const verificationFilters = [
    { value: 'all', label: 'All Users' },
    { value: 'true', label: 'Verified' },
    { value: 'false', label: 'Not Verified' },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Build the query parameters
      const params = new URLSearchParams();
      if (selectedDepartment !== 'all') {
        params.append('department', selectedDepartment);
      }
      if (verificationFilter !== 'all') {
        params.append('verified', verificationFilter);
      }
      
      const endpoint = `/api/users/list?${params.toString()}`;
      const response = await fetch(endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      if (result.success) {
        setUsers(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment, verificationFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerify = async (userId: string) => {
    toast.promise(
      fetch(`/api/users/verify?id=${userId}`, { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to verify user');
          fetchUsers(); // Refresh the list
          return res.json();
        }),
      {
        loading: 'Verifying user...',
        success: 'User verified successfully!',
        error: 'Failed to verify user'
      }
    );
  };

  const handleUnverify = async (userId: string) => {
    toast.promise(
      fetch(`/api/users/unverify?id=${userId}`, { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to unverify user');
          fetchUsers(); // Refresh the list
          return res.json();
        }),
      {
        loading: 'Unverifying user...',
        success: 'User unverified successfully',
        error: 'Failed to unverify user'
      }
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'chairperson':
        return <Shield className="mr-1 text-yellow-500" size={16} />;
      case 'vice chairperson':
      case 'general secretary':
      case 'treasurer':
        return <Shield className="mr-1 text-blue-500" size={16} />;
      case 'lead':
        return <Star className="mr-1 text-purple-500" size={16} />;
      case 'deputy lead':
        return <Star className="mr-1 text-indigo-500" size={16} />;
      default:
        return <User className="mr-1 text-gray-500" size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <UserCheck className="mr-2" size={20} />
          User Verification
        </h2>
        
        <div className="flex gap-4 items-center text-black">
          {canSelectDepartment && (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          )}
          
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
          >
            {verificationFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => fetchUsers()} 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Refresh users"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 text-gray-500 rounded-lg">
          No users found matching the selected filters
        </div>
      ) : (
        <div className="overflow-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="h-10 w-10 object-cover" />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-300">
                            <User size={20} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.registrationNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium">
                      {getRoleBadge(user.orgRole)}
                      <span className="capitalize">{user.orgRole}</span>
                    </div>
                    {user.isCoreCommittee && (
                      <div className="text-xs text-purple-600 mt-1">Core Committee</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.verifiedByPresident 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.verifiedByPresident ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* Only allow executives to trigger verify/unverify in the UI (server already enforces this) */}
                      {isExecutive && !user.verifiedByPresident && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors"
                          title="Verify user"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {isExecutive && user.verifiedByPresident && (
                        <button
                          onClick={() => handleUnverify(user._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                          title="Unverify user"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
