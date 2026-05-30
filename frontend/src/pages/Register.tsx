import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser, registerEmployer } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const candidateSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid phone number').optional(),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const employerSchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  city: yup.string().optional(),
});

export const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState<'candidate' | 'employer'>('candidate');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.auth);

  const candidateForm = useForm({ resolver: yupResolver(candidateSchema) as any });
  const employerForm = useForm({ resolver: yupResolver(employerSchema) as any });

  const onCandidateSubmit = async (data: any) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.payload as string);
    }
  };

  const onEmployerSubmit = async (data: any) => {
    const result = await dispatch(registerEmployer(data));
    if (registerEmployer.fulfilled.match(result)) {
      toast.success('Registration successful!');
      navigate('/employer/dashboard');
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'candidate' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('candidate')}
          >
            Candidate
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'employer' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('employer')}
          >
            Employer
          </button>
        </div>

        {activeTab === 'candidate' ? (
          <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                {...candidateForm.register('fullName')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  candidateForm.formState.errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {candidateForm.formState.errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{String(candidateForm.formState.errors.fullName.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...candidateForm.register('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  candidateForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {candidateForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{String(candidateForm.formState.errors.email.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                {...candidateForm.register('phone')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  candidateForm.formState.errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="9876543210"
              />
              {candidateForm.formState.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{String(candidateForm.formState.errors.phone.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...candidateForm.register('password')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  candidateForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Min 6 characters"
              />
              {candidateForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{String(candidateForm.formState.errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                {...employerForm.register('companyName')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  employerForm.formState.errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Acme Corp"
              />
              {employerForm.formState.errors.companyName && (
                <p className="text-red-500 text-xs mt-1">{String(employerForm.formState.errors.companyName.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...employerForm.register('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  employerForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="company@example.com"
              />
              {employerForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{String(employerForm.formState.errors.email.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...employerForm.register('password')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  employerForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Min 6 characters"
              />
              {employerForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{String(employerForm.formState.errors.password.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City (optional)</label>
              <input
                type="text"
                {...employerForm.register('city')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Mumbai"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register as Employer'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
