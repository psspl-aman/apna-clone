import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobs, setFilter } from '../features/jobs/jobsSlice';
import { Search, MapPin, ChevronRight, SlidersHorizontal, X, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

const WORK_MODE_OPTIONS = [
  { label: 'Work from Home', value: 'work_from_home' },
  { label: 'Work from Office', value: 'work_from_office' },
  { label: 'Field Job', value: 'field_job' },
];

const JOB_TYPE_OPTIONS = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Night Shift', value: 'night_shift' },
];

const EXP_OPTIONS = [
  { label: 'Fresher / No Experience', value: 0 },
  { label: '0 - 1 Year', value: 1 },
  { label: '1 - 2 Years', value: 2 },
  { label: '2 - 3 Years', value: 3 },
  { label: '3 - 5 Years', value: 5 },
  { label: '5 - 10 Years', value: 10 },
  { label: '10+ Years', value: 15 },
];

const DATE_OPTIONS = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last 7 Days', value: '7d' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Recent', value: 'recent' },
  { label: 'Salary (High to Low)', value: 'salary' },
];

const DEPARTMENT_OPTIONS = [
  'Sales', 'Finance', 'Engineering', 'Marketing', 'Operations',
  'Human Resources', 'Administration', 'Healthcare', 'IT', 'Creative',
  'Education', 'Legal', 'Logistics', 'Security', 'Kitchen',
];

const COMPANY_LOGO_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-red-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500',
];

function formatSalary(val?: number) {
  if (!val) return 'Not Disclosed';
  return '₹' + val.toLocaleString('en-IN');
}

function getJobTypeBadge(type?: string) {
  if (!type) return 'Not specified';
  const map: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    work_from_home: 'Work from Home',
    night_shift: 'Night Shift',
  };
  return map[type] || type.replace(/_/g, ' ');
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full py-1 text-sm font-semibold text-gray-800"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export const JobsPage = () => {
  const dispatch = useAppDispatch();
  const { jobs, filters, meta, loading } = useAppSelector((s) => s.jobs);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [cityInput, setCityInput] = useState(filters.city || '');
  const [showAllDepts, setShowAllDepts] = useState(false);

  useEffect(() => {
    const fromUrl: any = {};
    searchParams.forEach((value, key) => { fromUrl[key] = value; });
    if (Object.keys(fromUrl).length > 0) dispatch(setFilter(fromUrl));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 0 && value !== 'relevance') params.set(key, String(value));
    });
    setSearchParams(params, { replace: true });
    dispatch(fetchJobs(filters));
  }, [filters]);

  const updateFilter = (key: string, value: any) => dispatch(setFilter({ [key]: value }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({ keyword, city: cityInput }));
  };

  const clearAll = () => {
    setKeyword('');
    setCityInput('');
    dispatch(setFilter({
      keyword: '', city: '', category: '', department: '', job_type: '',
      work_mode: '', salary_min: 0, exp_min: 0, gender: '',
      date_posted: 'all', sort_by: 'relevance', page: 1,
    }));
  };

  const visibleDepts = showAllDepts ? DEPARTMENT_OPTIONS : DEPARTMENT_OPTIONS.slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">
            {meta?.total ? meta.total.toLocaleString('en-IN') : '0'} Jobs - Find the Latest Jobs Today
            {filters.city && <span className="font-normal text-gray-500 text-base"> in {filters.city}</span>}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search jobs by title, company, or keyword"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative sm:w-52">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter location"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4">

          {/* ── Filter Sidebar ── */}
          <aside className={`${
            mobileFiltersOpen ? 'fixed inset-0 z-50 overflow-auto bg-white p-4' : 'hidden'
          } lg:block lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 w-full lg:w-60 flex-shrink-0`}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                <div className="flex items-center gap-3">
                  <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="lg:hidden">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Date Posted */}
              <FilterSection title="Date Posted">
                {DATE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="radio"
                      name="date_posted"
                      checked={filters.date_posted === opt.value}
                      onChange={() => updateFilter('date_posted', opt.value)}
                      className="accent-primary"
                    />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
                {filters.date_posted !== 'all' && (
                  <button onClick={() => updateFilter('date_posted', 'all')} className="text-xs text-primary mt-1">Clear</button>
                )}
              </FilterSection>

              {/* Work Mode */}
              <FilterSection title="Work Mode">
                {WORK_MODE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.work_mode === opt.value}
                      onChange={() => updateFilter('work_mode', filters.work_mode === opt.value ? '' : opt.value)}
                      className="accent-primary rounded"
                    />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Salary */}
              <FilterSection title="Salary (Monthly Min)">
                <input
                  type="range" min="0" max="150000" step="5000"
                  value={filters.salary_min || 0}
                  onChange={(e) => updateFilter('salary_min', Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span className="font-semibold text-primary">₹{(filters.salary_min || 0).toLocaleString('en-IN')}</span>
                  <span>₹1.5L</span>
                </div>
              </FilterSection>

              {/* Experience */}
              <FilterSection title="Experience">
                {EXP_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.exp_min === opt.value}
                      onChange={() => updateFilter('exp_min', filters.exp_min === opt.value ? 0 : opt.value)}
                      className="accent-primary rounded"
                    />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Job Type */}
              <FilterSection title="Job Type">
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.job_type === opt.value}
                      onChange={() => updateFilter('job_type', filters.job_type === opt.value ? '' : opt.value)}
                      className="accent-primary rounded"
                    />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Department */}
              <FilterSection title="Department" defaultOpen={false}>
                {visibleDepts.map((dept) => (
                  <label key={dept} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.department === dept}
                      onChange={() => updateFilter('department', filters.department === dept ? '' : dept)}
                      className="accent-primary rounded"
                    />
                    <span className="text-xs text-gray-700">{dept}</span>
                  </label>
                ))}
                <button onClick={() => setShowAllDepts(!showAllDepts)} className="text-xs text-primary mt-1 hover:underline">
                  {showAllDepts ? 'View Less' : 'View All'}
                </button>
              </FilterSection>

              {/* Sort By */}
              <FilterSection title="Sort By" defaultOpen={false}>
                {SORT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort_by"
                      checked={filters.sort_by === opt.value}
                      onChange={() => updateFilter('sort_by', opt.value)}
                      className="accent-primary"
                    />
                    <span className="text-xs text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* ── Job Listings ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">{meta?.total || 0} results</p>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-700">No jobs found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                <button onClick={clearAll} className="mt-4 text-sm text-primary hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job, idx) => {
                  const logoColor = COMPANY_LOGO_COLORS[idx % COMPANY_LOGO_COLORS.length];
                  return (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {/* Company Logo */}
                        <div className={`h-12 w-12 ${logoColor} rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg`}>
                          {(job.company?.name?.[0] || 'C').toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-primary truncate">
                                {job.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">{job.company?.name}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Bookmark className="h-4 w-4 text-gray-400" />
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{job.city}</span>
                          </div>

                          <div className="mt-1.5 text-xs text-gray-700 font-medium">
                            {formatSalary(job.salaryMin)}{job.salaryMax ? ` - ${formatSalary(job.salaryMax)}` : ''}
                            <span className="font-normal text-gray-500 ml-1">monthly</span>
                          </div>

                          {/* Salary breakdown */}
                          {job.salaryMin && job.salaryMax && (
                            <div className="mt-2 grid grid-cols-2 border border-gray-100 rounded text-xs">
                              <div className="p-1.5 border-r border-gray-100">
                                <div className="text-gray-500">Fixed</div>
                                <div className="font-medium text-gray-800">{formatSalary(job.salaryMin)}</div>
                              </div>
                              <div className="p-1.5">
                                <div className="text-gray-500">Earning Potential</div>
                                <div className="font-medium text-gray-800">{formatSalary(job.salaryMax)}</div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.workLocationType && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {job.workLocationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {getJobTypeBadge(job.jobType)}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {job.experienceMin == null ? 'Any experience' : job.experienceMin === 0 ? 'Freshers only' : `${job.experienceMin}+ yrs exp`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6 pb-4">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => dispatch(setFilter({ page: meta.page - 1 }))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  &laquo; Prev
                </button>

                {(() => {
                  const pages: number[] = [];
                  const total = meta.totalPages;
                  const current = meta.page;
                  let start = Math.max(1, current - 2);
                  let end = Math.min(total, start + 4);
                  if (end - start < 4) start = Math.max(1, end - 4);
                  for (let p = start; p <= end; p++) pages.push(p);
                  return pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => dispatch(setFilter({ page: p }))}
                      className={`w-9 h-9 rounded text-sm font-medium ${
                        p === current
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ));
                })()}

                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => dispatch(setFilter({ page: meta.page + 1 }))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden xl:block w-64 flex-shrink-0 space-y-3">
            {/* Login with Apna */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Login with Apna and experience more!</h4>
              <ul className="text-xs text-gray-600 space-y-1.5 mt-3">
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✓</span> Personalised job matches</li>
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✓</span> Direct connect with HRs</li>
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✓</span> Latest updates on the job</li>
              </ul>
              <div className="mt-3 bg-gray-100 rounded-lg h-28 flex items-center justify-center text-gray-400 text-xs">📱 App Preview</div>
              <Link
                to="/register"
                className="block mt-3 w-full bg-primary text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-primary-600"
              >
                Create profile &rsaquo;
              </Link>
            </div>

            {/* Download App */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-2">Apply on the go</h4>
              <p className="text-xs text-gray-500 mb-3">Get real time job updates on our App</p>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  <span className="text-lg">🍎</span>
                  <div>
                    <div className="text-[10px] text-gray-500">Download on the</div>
                    <div className="text-xs font-semibold text-gray-800">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  <span className="text-lg">▶</span>
                  <div>
                    <div className="text-[10px] text-gray-500">Get it on</div>
                    <div className="text-xs font-semibold text-gray-800">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
