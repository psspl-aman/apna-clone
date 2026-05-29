import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { Briefcase, ChevronDown, LogOut, User, Menu, X } from 'lucide-react';
import { JobsDropdown } from './JobsDropdown';

export const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">Apna</span>
            </Link>

            <div
              className="hidden md:block relative"
              onMouseEnter={() => { setJobsOpen(true); setDropdownOpen(false); }}
              onMouseLeave={() => setJobsOpen(false)}
            >
              <Link
                to="/jobs"
                className={`flex items-center gap-1 text-sm font-medium py-2 ${
                  jobsOpen ? 'text-[#1a7d4e]' : 'text-gray-700'
                } hover:text-[#1a7d4e] transition-colors`}
              >
                Jobs
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    jobsOpen ? 'rotate-180' : ''
                  }`}
                />
              </Link>
              <JobsDropdown isOpen={jobsOpen} onClose={() => setJobsOpen(false)} />
            </div>

            <Link
              to="/job-prep"
              onClick={() => { setJobsOpen(false); setDropdownOpen(false); }}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1a7d4e] transition-colors py-2"
            >
              Job Prep
              <span className="text-[10px] font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded-full leading-none">NEW</span>
            </Link>

            <Link
              to="/contest"
              onClick={() => { setJobsOpen(false); setDropdownOpen(false); }}
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-[#1a7d4e] transition-colors py-2"
            >
              Contest
            </Link>

            <Link
              to="/degree"
              onClick={() => { setJobsOpen(false); setDropdownOpen(false); }}
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-[#1a7d4e] transition-colors py-2"
            >
              Degree
            </Link>

            <Link
              to="/resume-tool"
              onClick={() => { setJobsOpen(false); setDropdownOpen(false); }}
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-[#1a7d4e] transition-colors py-2"
            >
              Resume Tool
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'employer' && (
                  <Link
                    to="/employer/post-job"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600"
                  >
                    Post a Job
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => { setDropdownOpen(!dropdownOpen); setJobsOpen(false); }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                      {user?.role === 'candidate' && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" /> Profile
                        </Link>
                      )}
                      {user?.role === 'employer' && (
                        <Link
                          to="/employer/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { handleLogout(); setDropdownOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/employer/login"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50"
                >
                  Employer Login
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600"
                >
                  Candidate Login
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
          <Link to="/job-prep" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Job Prep</Link>
          <Link to="/contest" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Contest</Link>
          <Link to="/degree" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Degree</Link>
          <Link to="/resume-tool" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Resume Tool</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'candidate' && (
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              )}
              {user?.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/employer/post-job" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>Post a Job</Link>
                </>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/employer/login" className="block px-4 py-2 text-sm text-primary border border-primary rounded text-center" onClick={() => setMobileMenuOpen(false)}>Employer Login</Link>
              <Link to="/login" className="block px-4 py-2 text-sm text-white bg-primary rounded text-center" onClick={() => setMobileMenuOpen(false)}>Candidate Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
