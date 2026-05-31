import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { setFilter } from '../../features/jobs/jobsSlice';

const FIND_JOBS_CITIES: { label: string; slug: string }[] = [
  { label: 'Agra', slug: 'agra' },
  { label: 'Ahmedabad', slug: 'ahmedabad' },
  { label: 'Amritsar', slug: 'amritsar' },
  { label: 'Aurangabad', slug: 'aurangabad' },
  { label: 'Bareilly', slug: 'bareilly' },
  { label: 'Bengaluru', slug: 'bengaluru' },
  { label: 'Bhopal', slug: 'bhopal' },
  { label: 'Bhubaneswar', slug: 'bhubaneswar' },
  { label: 'Chandigarh', slug: 'chandigarh' },
  { label: 'Chennai', slug: 'chennai' },
  { label: 'Coimbatore', slug: 'coimbatore' },
  { label: 'Delhi-NCR', slug: 'delhi-ncr' },
];

const START_HIRING_CITIES: { label: string; slug: string }[] = [
  { label: 'Agra', slug: 'agra' },
  { label: 'Ahmedabad', slug: 'ahmedabad' },
  { label: 'Bengaluru', slug: 'bengaluru' },
  { label: 'Chennai', slug: 'chennai' },
  { label: 'Delhi-NCR', slug: 'delhi-ncr' },
  { label: 'Hyderabad', slug: 'hyderabad' },
  { label: 'Kolkata', slug: 'kolkata' },
  { label: 'Mumbai', slug: 'mumbai' },
  { label: 'Pune', slug: 'pune' },
  { label: 'Jaipur', slug: 'jaipur' },
  { label: 'Lucknow', slug: 'lucknow' },
  { label: 'Noida', slug: 'noida' },
];

const POPULAR_JOBS: { label: string; filter: Record<string, string | number> }[] = [
  { label: 'Delivery Person Jobs',  filter: { category: 'delivery_person' } },
  { label: 'Accounts / Finance Jobs', filter: { category: 'accounts_finance' } },
  { label: 'Sales (Field Work)',    filter: { category: 'field_sales' } },
  { label: 'Human Resource',        filter: { category: 'human_resource' } },
  { label: 'Backoffice Jobs',       filter: { category: 'admin_office_assistant' } },
  { label: 'Business Development',  filter: { category: 'business_development' } },
  { label: 'Telecaller / BPO',      filter: { category: 'telecalling_bpo_telesales' } },
  { label: 'Work from Home Jobs',   filter: { job_type: 'work_from_home' } },
  { label: 'Night Shift Jobs',      filter: { job_type: 'night_shift' } },
  { label: 'Part Time Jobs',        filter: { job_type: 'part_time' } },
  { label: 'Full Time Jobs',        filter: { job_type: 'full_time' } },
  { label: 'Freshers Jobs',         filter: { exp_min: 0, exp_max: 0 } },
];

const DEPARTMENTS: { label: string; slug: string }[] = [
  { label: 'Admin / Back Office / Computer Operator', slug: 'admin_office_assistant' },
  { label: 'Advertising / Communication',             slug: 'content_writing' },
  { label: 'Aviation & Aerospace',                    slug: 'hospitality_hotel_event_management' },
  { label: 'Banking / Insurance / Financial Services', slug: 'accounts_finance' },
  { label: 'Beauty, Fitness & Personal Care',         slug: 'beautician_hair_stylist' },
  { label: 'Construction & Site Engineering',         slug: 'civil_engineer_architect' },
  { label: 'Consulting',                              slug: 'business_development' },
  { label: 'Content, Editorial & Journalism',         slug: 'content_writing' },
  { label: 'CSR & Social Service',                    slug: 'business_development' },
  { label: 'Customer Support',                        slug: 'telecalling_bpo_telesales' },
  { label: 'Data Science & Analytics',                slug: 'software_web_developer' },
  { label: 'Delivery / Driver / Logistics',           slug: 'delivery_person' },
];

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Hide the entire footer on the browse page (it IS the browse page)
  if (location.pathname === '/jobs/browse') return null;

  const goCity = (slug: string) => {
    dispatch(setFilter({ city: slug }));
    navigate(`/jobs?city=${encodeURIComponent(slug)}`);
  };

  const goDept = (slug: string) => {
    dispatch(setFilter({ category: slug }));
    navigate(`/jobs?category=${encodeURIComponent(slug)}`);
  };

  const goJob = (filter: Record<string, string | number>) => {
    dispatch(setFilter(filter as any));
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== '' && v !== undefined) params.set(k, String(v));
    });
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <footer className="mt-auto">
      {/* Main footer - light background */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Find Jobs */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Find Jobs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1.5">
              {FIND_JOBS_CITIES.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => goCity(city.slug)}
                  className="text-left text-xs text-gray-600 hover:text-primary"
                >
                  Jobs in {city.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/jobs/browse?section=city')}
              className="text-xs text-primary mt-2 hover:underline"
            >
              View more ⌄
            </button>
          </div>

          {/* Start Hiring */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Start Hiring</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1.5">
              {START_HIRING_CITIES.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => navigate('/employer/login')}
                  className="text-left text-xs text-gray-600 hover:text-primary"
                >
                  Hire in {city.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/employer/login')}
              className="text-xs text-primary mt-2 hover:underline"
            >
              View more ⌄
            </button>
          </div>

          {/* Popular Jobs */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Popular Jobs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
              {POPULAR_JOBS.map((job) => (
                <button
                  key={job.label}
                  onClick={() => goJob(job.filter)}
                  className="text-left text-xs text-gray-600 hover:text-primary"
                >
                  {job.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/jobs/browse?section=department')}
              className="text-xs text-primary mt-2 hover:underline"
            >
              View more ⌄
            </button>
          </div>

          {/* Jobs by Department */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Jobs by Department</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.slug + dept.label}
                  onClick={() => goDept(dept.slug)}
                  className="text-left text-xs text-gray-600 hover:text-primary"
                >
                  {dept.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/jobs/browse?section=department')}
              className="text-xs text-primary mt-2 hover:underline"
            >
              View more ⌄
            </button>
          </div>

          {/* Bottom links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-6 pt-6 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Download Apna App</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Free Job Alerts</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Careers</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Contact Us</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Vulnerability Disclosure Policy</a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Privacy Policy</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">User Terms &amp; Conditions</a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Blog</a>
                <a href="#" className="block text-xs text-gray-600 hover:text-primary">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dark bar */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo + Social */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">a</span>
                </div>
                <span className="text-white font-bold text-base">apna</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">Follow us on social media</p>
                <div className="flex items-center gap-3">
                  {/* Social icons */}
                  {[
                    { label: 'f', href: '#', bg: 'bg-blue-600' },
                    { label: 'in', href: '#', bg: 'bg-blue-700' },
                    { label: '\u2708', href: '#', bg: 'bg-sky-500' },
                    { label: '\u25a1', href: '#', bg: 'bg-pink-600' },
                    { label: '\u25ba', href: '#', bg: 'bg-red-600' },
                  ].map((s, i) => (
                    <a key={i} href={s.href}
                      className={`h-7 w-7 ${s.bg} rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80`}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply on the go */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">Apply on the go</p>
                <p className="text-gray-500 text-[11px] mb-2">Get real time job updates on our App</p>
                <div className="flex gap-2">
                  <a href="#" className="flex items-center gap-1.5 border border-gray-600 rounded px-2 py-1 hover:border-gray-400">
                    <span className="text-white text-sm"></span>
                    <div>
                      <div className="text-[9px] text-gray-400">Download on the</div>
                      <div className="text-xs text-white font-semibold">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-1.5 border border-gray-600 rounded px-2 py-1 hover:border-gray-400">
                    <span className="text-white text-sm">▶</span>
                    <div>
                      <div className="text-[9px] text-gray-400">Get it on</div>
                      <div className="text-xs text-white font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} Apna | All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300">Apna Advantage T&amp;C</a>
              <a href="#" className="hover:text-gray-300">Rewards T&amp;C</a>
              <a href="#" className="hover:text-gray-300">AI Prep T&amp;C</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
