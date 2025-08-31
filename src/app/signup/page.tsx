'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Phone, Building, Lock, UserCheck, Users } from 'lucide-react';

interface FormData {
  name: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  branch?: string;
  password: string;
  confirmPassword?: string;
  department: string;
  orgRole: string;
  isCoreCommittee: boolean;
  verifiedByPresident: boolean;
  profilePicture: string;
}


const SignupPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    branch: '',
    password: '',
    confirmPassword: '',
    department: '',
    orgRole: 'member',
    isCoreCommittee: false,
    verifiedByPresident: false,
    profilePicture: "https://res.cloudinary.com/dpbjhiguv/image/upload/v1756234445/gallery/vif3hrmdqfkjc1jfmho5.jpg"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions = ['project', 'events', 'outreach', 'design'];
  const orgRoleOptions = [
    { value: 'chairperson', label: 'Chairperson' },
    { value: 'vice chairperson', label: 'Vice Chairperson' },
    { value: 'general secretary', label: 'General Secretary' },
    { value: 'treasurer', label: 'Treasurer' },
    { value: 'lead', label: 'Lead' },
    { value: 'deputy lead', label: 'Deputy Lead' },
    { value: 'member', label: 'Member' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!(formData.branch ?? '').trim()) newErrors.branch = 'Branch is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  try {

    const submitData = {
      ...formData,
    };

    // ✅ remove confirmPassword before sending
    delete submitData.confirmPassword;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    const data = await response.json();

    if (data.success) {
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/login";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};



  return (
    
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Join Our Community
            </h1>
            <p className="text-gray-400 text-lg">Create your account and become part of something extraordinary</p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <User className="mr-3 text-purple-400" size={24} />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                      placeholder="Enter registration number"
                    />
                    {errors.registrationNumber && <p className="text-red-400 text-sm">{errors.registrationNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-400 text-sm">{errors.phoneNumber}</p>}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Branch</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="Enter your branch (e.g., Computer Science)"
                      />
                    </div>
                    {errors.branch && <p className="text-red-400 text-sm">{errors.branch}</p>}
                  </div>
                </div>
              </div>

              {/* Role Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Users className="mr-3 text-blue-400" size={24} />
                  Role Information
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Organization Role</label>
                    <select
                      name="orgRole"
                      value={formData.orgRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    >
                      {orgRoleOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                    >
                      <option value="" className="bg-gray-800">Select Department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept} className="bg-gray-800 capitalize">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className=" items-center space-x-4 mt-4 hidden">
                    <label className="flex items-center text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="isCoreCommittee"
                        checked={formData.isCoreCommittee}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled
                      />
                      Core Committee
                    </label>
                    <label className="flex items-center text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="verifiedByPresident"
                        checked={formData.verifiedByPresident}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Verified by President
                    </label>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Lock className="mr-3 text-pink-400" size={24} />
                  Security
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-11 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-11 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserCheck className="mr-2" size={20} />
                      Create Account
                    </div>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default SignupPage;