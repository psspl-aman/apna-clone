import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobs, setFilter } from '../features/jobs/jobsSlice';
import { Search, MapPin, Briefcase, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

const experienceOptions = ['Fresher', '1 year', '2 years', '3 years', '5+ years', '10+ years'];
const jobTypeOptions = ['Full Time', 'Part Time', 'Work From Home', 'Night Shift'];
const datePostedOptions = ['All', 'Last 24 hours', 'Last 3 days', 'Last 7 days'];

const companyLogos = ['TCS', 'Infosys', 'Wipro', 'HCL', 'TechM', 'Accenture', 'Cognizant', 'Capgemini'];

export const JobsPage = () => {
  const dispatch = useAppDispatch();
  const { jobs, filters, meta, loading } = useAppSelector((s) => s.jobs);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fromUrl: any = {};
    searchParams.forEach((value, key) => {
      fromUrl[key] = value;
    });
    if (Object.keys(fromUrl).length > 0) {
      dispatch(setFilter(fromUrl));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 0) params.set(key, String(value));
    });
    setSearchParams(params, { replace: true });
    dispatch(fetchJobs(filters));
  }, [filters]);

  const updateFilter = (key: string, value: any) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const keyword = form.get('keyword') as string;
    const city = form.get('city') as string;
    const exp = form.get('experience') as string;
    dispatch(setFilter({ keyword, city, exp_min: exp ? Number(exp) : 0 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white border rounded-xl p-3 flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="keyword"
            defaultValue={filters.keyword}
            placeholder="Search for jobs..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-full md:w-36">
          <select
            name="experience"
            defaultValue={filters.exp_min || ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
          >
            <option value="">Experience</option>
            <option value="0">Fresher</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="city"
            defaultValue={filters.city}
            placeholder="Enter city"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
          Search
        </button>
      </form>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Showing {meta?.total || 0} jobs based on your profile
          </p>
          {filters.city && (
            <p className="text-sm text-gray-500">Jobs near <span className="font-medium text-gray-700">{filters.city}</span> Region</p>
          )}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
          <div className="bg-white border rounded-xl p-5 space-y-6 sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Date Posted */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Date Posted</h4>
              <div className="space-y-2">
                {datePostedOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="date_posted"
                      checked={filters.date_posted === opt.toLowerCase().replace(/\s+/g, '_') || (filters.date_posted === 'all' && opt === 'All')}
                      onChange={() => updateFilter('date_posted', opt === 'All' ? 'all' : opt.toLowerCase().replace(/\s+/g, '_'))}
                      className="text-primary"
                    />
                    <span className="text-sm text-gray-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Salary (Min)</h4>
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={filters.salary_min || 0}
                onChange={(e) => updateFilter('salary_min', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span className="font-medium text-primary">₹{(filters.salary_min || 0).toLocaleString()}</span>
                <span>₹1.5L</span>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Experience</h4>
              <select
                value={filters.exp_min || 0}
                onChange={(e) => updateFilter('exp_min', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {experienceOptions.map((exp, i) => (
                  <option key={exp} value={i}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Job Type</h4>
              <div className="space-y-2">
                {jobTypeOptions.map((type) => {
                  const val = type.toLowerCase().replace(/\s+/g, '_');
                  return (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.job_type === val}
                        onChange={() => updateFilter('job_type', filters.job_type === val ? '' : val)}
                        className="text-primary rounded"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => dispatch(setFilter({ keyword: '', city: '', category: '', job_type: '', salary_min: 0, exp_min: 0, date_posted: 'all', page: 1 }))}
              className="w-full text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white border rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No jobs found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-500">
                      {job.company?.name?.[0] || 'C'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company?.name}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.city}
                      </span>
                      <span>💰 ₹{job.salaryMin?.toLocaleString() || 'Not Disclosed'}{job.salaryMax ? ` - ₹${job.salaryMax.toLocaleString()}` : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">
                        {job.jobType?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        Min. {job.experienceMin} years
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={meta.page <= 1}
                onClick={() => dispatch(setFilter({ page: meta.page - 1 }))}
                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => dispatch(setFilter({ page: pageNum }))}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      meta.page === pageNum ? 'bg-primary text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => dispatch(setFilter({ page: meta.page + 1 }))}
                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-72 flex-shrink-0 space-y-4">
          <div className="bg-white border rounded-xl p-5 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold text-gray-900">Complete your profile</h4>
            <p className="text-sm text-gray-500 mt-1">Get noticed by employers</p>
            <button className="mt-3 text-sm text-primary font-medium hover:underline">Complete Now</button>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-3">Track Applications</h4>
            <p className="text-sm text-gray-500">Monitor your job applications</p>
            <Link to="/profile" className="mt-3 inline-block text-sm text-primary font-medium hover:underline">View Status</Link>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-600 rounded-xl p-5 text-white text-center">
            <p className="text-lg font-bold">Download App</p>
            <p className="text-sm text-primary-50 mt-1">Get job alerts on the go</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

function User(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
