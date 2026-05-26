import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">Apna</span>
            </div>
            <p className="text-sm">India's #1 job platform for blue-collar &amp; grey-collar workers.</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">For Job Seekers</h3>
            <div className="space-y-2 text-sm">
              <Link to="/jobs" className="block hover:text-white">Browse Jobs</Link>
              <Link to="/dashboard" className="block hover:text-white">My Dashboard</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">For Employers</h3>
            <div className="space-y-2 text-sm">
              <Link to="/employer/post-job" className="block hover:text-white">Post a Job</Link>
              <Link to="/employer/dashboard" className="block hover:text-white">Employer Dashboard</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block hover:text-white">About Us</a>
              <a href="#" className="block hover:text-white">Contact</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Apna Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
