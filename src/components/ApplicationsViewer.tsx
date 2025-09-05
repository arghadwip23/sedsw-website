'use client';

import React, { useState, useEffect } from 'react';
import { Application } from '@/types/Application';
import { Loader2, RefreshCw, Check, X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ApplicationsViewerProps {
  userRole: string;
  userDepartment: string;
  isAdmin: boolean;
  isCoreCommittee?: boolean;
}

export default function ApplicationsViewer({ userRole, userDepartment, isAdmin, isCoreCommittee = false }: ApplicationsViewerProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    ['chairperson', 'vice chairperson', 'general secretary', 'treasurer'].includes(userRole) || isAdmin 
      ? 'all' 
      : userDepartment
  );

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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const endpoint = `/api/applications/pending${selectedDepartment !== 'all' ? `?department=${selectedDepartment}` : ''}`;
      const response = await fetch(endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch applications');
      }

      if (result.success) {
        setApplications(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch applications');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedDepartment]);

  const handleApprove = async (applicationId: string) => {
    // Get token from cookies
    const getToken = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
      }
      return null;
    };
    const token = getToken();
    toast.promise(
      fetch('/api/applications/approve/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, applicationId })
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to approve application');
          fetchApplications(); // Refresh the list
          return res.json();
        }),
      {
        loading: 'Approving application...',
        success: 'Application approved successfully!',
        error: 'Failed to approve application'
      }
    );
  };

  const handleReject = async (applicationId: string) => {
    toast.promise(
      fetch(`/api/applications/reject/${applicationId}`, { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to reject application');
          fetchApplications(); // Refresh the list
          return res.json();
        }),
      {
        loading: 'Rejecting application...',
        success: 'Application rejected successfully',
        error: 'Failed to reject application'
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <UserPlus className="mr-2" size={20} />
          Pending Applications
        </h2>
        
        <div className="flex gap-4 items-center">
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
          
          <button 
            onClick={() => fetchApplications()} 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Refresh applications"
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
      ) : applications.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 text-gray-500 rounded-lg">
          No pending applications found for {selectedDepartment === 'all' ? 'any department' : selectedDepartment}
        </div>
      ) : (
        <div className="overflow-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.registrationNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                    <div className="text-sm text-gray-500">{app.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{app.email}</div>
                    <div className="text-sm text-gray-500">{app.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">1st: {app.primaryDepartment}</div>
                    <div className="text-sm text-gray-500">2nd: {app.secondaryDepartment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/** Only show approve/reject to core committee members (defense-in-depth: server also enforces) */}
                      {isCoreCommittee && (
                        <>
                          <button
                            onClick={() => app._id && handleApprove(app._id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors"
                            title="Approve application"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => app._id && handleReject(app._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                            title="Reject application"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {!isCoreCommittee && (
                        <div className="text-xs text-gray-500 italic">Only core committee can approve/reject</div>
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
