import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center relative max-w-lg w-full">
        {/* Large watermark 404 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-8xl font-black text-primary opacity-10">404</span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-primary flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Oops! Page not found
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-8 max-w-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Quick links */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              to="/"
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go Home
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-primary text-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/profile"
              className="border-2 border-gray-300 text-gray-600 font-semibold px-6 py-2.5 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              My Profile
            </Link>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <p className="text-sm text-gray-400 mb-3">Or search for a job directly</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search for jobs..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
