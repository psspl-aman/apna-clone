import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';
import api from '../services/api';
import { jobsService } from '../services/jobs.service';
import toast from 'react-hot-toast';
import {
  Briefcase, BarChart2, CreditCard, FileText, Gift,
  HelpCircle, Phone, LogOut, Plus, MoreVertical,
  Menu, X, ChevronDown, Trash2, Eye, MapPin,
  Calendar, User, CheckCircle, AlertCircle,
} from 'lucide-react';

type View = 'jobs' | 'post-job' | 'company' | 'reports' | 'credits' | 'billing';

const NAV_ITEMS = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'credits', label: 'Credits & usage', icon: CreditCard },
  { id: 'billing', label: 'Billing', icon: FileText },
  { id: 'refer', label: 'Refer & Earn', icon: Gift },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'sales', label: 'Contact Sales', icon: Phone, badge: 'Offers' },
];

export const EmployerDashboard = ({ defaultView = 'jobs' }: { defaultView?: View }) => {
  const [activeView, setActiveView] = useState<View>(defaultView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [postingJob, setPostingJob] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingFilter, setBillingFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* ── Load data ── */
  useEffect(() => {
    loadDashboard();
    loadLookups();
  }, []);

  useEffect(() => {
    if (activeView === 'billing') loadBillingHistory();
  }, [activeView]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [companyRes, jobsRes] = await Promise.all([
        api.get('/companies/me'),
        api.get('/jobs/my'),
      ]);
      setCompany(companyRes.data.data);
      const fetchedJobs: any[] = jobsRes.data.data || [];
      setJobs(fetchedJobs);

      // Fetch application counts in parallel
      const counts: Record<string, number> = {};
      await Promise.all(
        fetchedJobs.map(async (job: any) => {
          try {
            const res = await api.get(`/applications/job/${job.id}`);
            counts[job.id] = res.data.data?.length ?? 0;
          } catch {
            counts[job.id] = 0;
          }
        }),
      );
      setApplicationCounts(counts);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadBillingHistory = async () => {
    try {
      setBillingLoading(true);
      const res = await api.get('/payments/history');
      setBillingHistory(res.data.data || []);
    } catch {
      /* non-critical */
    } finally {
      setBillingLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [catRes, cityRes] = await Promise.all([
        api.get('/categories'),
        api.get('/cities'),
      ]);
      setCategories(catRes.data.data || []);
      setCities(cityRes.data.data || []);
    } catch { /* non-critical */ }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await jobsService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
    setOpenMenu(null);
  };

  const handleToggleActive = async (job: any) => {
    try {
      await jobsService.updateJob(job.id, { is_active: !job.is_active } as any);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, is_active: !j.is_active } : j)),
      );
      toast.success(job.is_active ? 'Job deactivated' : 'Job activated');
    } catch {
      toast.error('Failed to update job');
    }
    setOpenMenu(null);
  };

  const handleDuplicateJob = (job: any) => {
    // Open wizard pre-filled with job data but no jobId (creates a new draft)
    navigate('/employer/post-job', {
      state: {
        prefill: job,
        initialStep: 0,
      },
    });
    setOpenMenu(null);
  };

  const handleEditJob = (job: any) => {
    navigate('/employer/post-job', {
      state: {
        jobId: job.id,
        prefill: job,
        isPaid: job.is_paid,
        // Paid jobs start at preview (step 3), unpaid at step 0
        initialStep: job.is_paid ? 3 : 0,
      },
    });
    setOpenMenu(null);
  };

  const handleFinishPosting = (job: any) => {
    navigate('/employer/post-job', {
      state: {
        jobId: job.id,
        prefill: job,
        isPaid: false,
        initialStep: 3, // Jump to preview step
      },
    });
  };

  const handlePostJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = {
      title: form.get('title'),
      category: form.get('category'),
      city: form.get('city'),
      job_type: form.get('job_type'),
      salary_min: Number(form.get('salary_min')) || 0,
      salary_max: Number(form.get('salary_max')) || 0,
      experience_min: Number(form.get('experience_min')) || 0,
      experience_max: Number(form.get('experience_max')) || 0,
      education: form.get('education'),
      openings: Number(form.get('openings')) || 1,
      gender: form.get('gender') || 'any',
      description: form.get('description'),
    };
    try {
      setPostingJob(true);
      const res = await api.post('/jobs', data);
      const newJob = res.data.data;
      setJobs((prev) => [newJob, ...prev]);
      setApplicationCounts((prev) => ({ ...prev, [newJob.id]: 0 }));
      toast.success('Job posted successfully!');
      setActiveView('jobs');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setPostingJob(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = {
      name: form.get('name'),
      description: form.get('description'),
      website: form.get('website'),
      city: form.get('city'),
      industry: form.get('industry'),
      employee_size: form.get('employee_size'),
    };
    try {
      setSavingCompany(true);
      const res = await api.put('/companies/me', data);
      setCompany(res.data.data);
      toast.success('Company profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update company');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/employer/login');
  };

  const companyInitial = company?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'E';
  const userInitial = (company?.name?.[0] || user?.email?.[0] || 'E').toUpperCase();
  const displayName = company?.name || user?.email || 'Employer';
  const displayPhone = (user as any)?.phone || user?.email || '';

  /* ──────────────────────── RENDER ──────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ══════════════ LEFT SIDEBAR ══════════════ */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-white border-r flex flex-col transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-56'
        } w-56`}
      >
        {/* Company section */}
        <div className={`border-b flex items-center gap-3 ${
          sidebarCollapsed ? 'p-3 justify-center' : 'p-4'
        }`}>
          <div className="h-10 w-10 rounded-md bg-gray-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0"
            title={sidebarCollapsed ? (company?.name || 'Your Company') : ''}>
            {companyInitial}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {company?.name || 'Your Company'}
              </p>
              <p className="text-xs text-gray-400 truncate">{company?.city || ''}</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const clickable = ['jobs', 'reports', 'credits', 'billing'].includes(item.id);
            return (
              <button
                key={item.id}
                title={sidebarCollapsed ? item.label : ''}
                onClick={() => {
                  if (clickable) setActiveView(item.id as View);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center py-2.5 text-sm font-medium transition-colors ${
                  sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                } ${
                  isActive
                    ? 'bg-[#e8f5ef] text-[#1a7d4e] border-r-2 border-[#1a7d4e]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t space-y-2">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-2 rounded-full">
              <span>🏷️</span> Up to 53% OFF
            </div>
          )}
          <button
            title={sidebarCollapsed ? 'Buy credits' : ''}
            className={`w-full flex items-center border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors ${
              sidebarCollapsed ? 'justify-center px-0' : 'justify-center gap-2'
            }`}>
            <CreditCard className="h-4 w-4" />
            {!sidebarCollapsed && 'Buy credits'}
          </button>
          <button
            title={sidebarCollapsed ? 'Sign out' : ''}
            onClick={handleLogout}
            className={`w-full flex items-center text-red-500 text-sm font-medium py-2 rounded-lg hover:bg-red-50 transition-colors ${
              sidebarCollapsed ? 'justify-center px-0' : 'justify-center gap-2'
            }`}>
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Header ── */}
        <header className="bg-white border-b px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile opens overlay, desktop collapses sidebar */}
            <button
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-lg font-bold">
              <span style={{ color: '#1a7d4e' }}>apna</span>
              <span className="text-gray-900">Hire</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <CreditCard className="h-4 w-4" />
              Available Credits
            </button>

            {/* Avatar with dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold focus:outline-none"
                style={{ backgroundColor: '#7c3aed' }}
              >
                {userInitial}
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: '#7c3aed' }}>
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{displayPhone}</p>
                    </div>
                  </div>

                  {/* View profile */}
                  <button
                    onClick={() => {
                      setActiveView('company');
                      setAvatarOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    View profile
                  </button>

                  {/* Sign out */}
                  <button
                    onClick={() => { handleLogout(); setAvatarOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main scrollable content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ════════ JOBS VIEW ════════ */}
          {activeView === 'jobs' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-gray-900">
                  All Jobs ({loading ? '…' : jobs.length})
                </h1>
                <Link
                  to="/employer/post-job"
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg"
                  style={{ backgroundColor: '#1a7d4e' }}
                >
                  <Plus className="h-4 w-4" />
                  Post a new job
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center">
                  <Briefcase className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium text-lg mb-1">No jobs posted yet</p>
                  <p className="text-gray-400 text-sm mb-5">Start hiring by posting your first job</p>
                  <Link
                    to="/employer/post-job"
                    className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg inline-block"
                    style={{ backgroundColor: '#1a7d4e' }}
                  >
                    Post a new job
                  </Link>
                </div>
              ) : (
                <div className="space-y-3" ref={menuRef}>
                  {jobs.map((job) => {
                    const isPaid: boolean = job.is_paid;
                    const appliedCount = applicationCounts[job.id] ?? 0;
                    return (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-200">
                      <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">

                        {/* Job info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                            {!isPaid ? (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-600">
                                Select Plan
                              </span>
                            ) : job.is_active ? (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">Active</span>
                            ) : (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            {job.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" /> {job.city}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Posted on: {new Date(job.created_at || job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" /> {company?.name || 'Your company'}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm flex-shrink-0">
                          <div className="text-center">
                            <p className="font-bold text-gray-900 text-lg">
                              {isPaid ? appliedCount : '-'}
                            </p>
                            <p className="text-gray-400 text-xs">Applied to job</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900 text-lg">{isPaid ? (job.openings || 1) : 0}</p>
                            <p className="text-gray-400 text-xs">Database Matches</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!isPaid ? (
                            <button
                              onClick={() => handleFinishPosting(job)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Finish posting
                            </button>
                          ) : appliedCount > 0 ? (
                            <Link
                              to={`/jobs/${job.id}`}
                              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" /> View Applicants
                            </Link>
                          ) : null}

                          {/* Three-dot menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                            {openMenu === job.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border z-50 py-1">
                                <button
                                  onClick={() => handleEditJob(job)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit job
                                </button>
                                <button
                                  onClick={() => handleDuplicateJob(job)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Duplicate
                                </button>
                                {isPaid && (
                                  <button
                                    onClick={() => handleToggleActive(job)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    {job.is_active ? 'Deactivate' : 'Activate'}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete job
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Info bar — only for unpaid drafts */}
                      {!isPaid && (
                        <div className="border-t bg-blue-50 px-5 py-2.5 flex items-center gap-2 text-sm text-blue-700 rounded-b-xl">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          Finish job posting to start receiving candidates
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════ POST JOB VIEW ════════ */}
          {activeView === 'post-job' && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setActiveView('jobs')}
                  className="text-gray-400 hover:text-gray-700"
                >
                  ← Back
                </button>
                <h1 className="text-xl font-bold text-gray-900">Post a New Job</h1>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <form onSubmit={handlePostJob} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                      <input
                        name="title" required
                        placeholder="e.g. Sales Executive, Full-stack Developer"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <select name="category" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] bg-white">
                        <option value="">Select category</option>
                        {categories.length > 0
                          ? categories.map((c: any) => (
                              <option key={c.id} value={c.slug}>{c.label}</option>
                            ))
                          : ['Sales', 'Telecalling', 'Delivery', 'Driver', 'Accounts', 'Software'].map((c) => (
                              <option key={c} value={c.toLowerCase()}>{c}</option>
                            ))
                        }
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                      <input
                        name="city" required
                        list="cities-list"
                        placeholder="e.g. Mumbai, Delhi-NCR"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                      <datalist id="cities-list">
                        {cities.map((c: any) => <option key={c.id} value={c.name} />)}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                      <select name="job_type" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] bg-white">
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="work_from_home">Work From Home</option>
                        <option value="night_shift">Night Shift</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender Preference</label>
                      <select name="gender" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] bg-white">
                        <option value="any">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary (₹/month)</label>
                      <input
                        name="salary_min" type="number" min="0"
                        placeholder="e.g. 15000"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary (₹/month)</label>
                      <input
                        name="salary_max" type="number" min="0"
                        placeholder="e.g. 30000"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Experience (years)</label>
                      <input
                        name="experience_min" type="number" min="0"
                        placeholder="0 for Fresher"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Experience (years)</label>
                      <input
                        name="experience_max" type="number" min="0"
                        placeholder="e.g. 5"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Education</label>
                      <select name="education" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] bg-white">
                        <option value="">Any</option>
                        <option value="10th">10th Pass</option>
                        <option value="12th">12th Pass</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Openings</label>
                      <input
                        name="openings" type="number" min="1" defaultValue={1}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
                    <textarea
                      name="description" required rows={5}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={postingJob}
                      className="px-8 py-3 text-white font-semibold rounded-lg text-sm disabled:opacity-60"
                      style={{ backgroundColor: '#1a7d4e' }}
                    >
                      {postingJob ? 'Posting…' : 'Publish Job'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('jobs')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ════════ COMPANY PROFILE VIEW ════════ */}
          {activeView === 'company' && (
            <div className="max-w-2xl">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h1>
              <div className="bg-white rounded-xl border p-6">
                <form onSubmit={handleSaveCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                    <input
                      name="name" required defaultValue={company?.name || ''}
                      className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      name="description" rows={4} defaultValue={company?.description || ''}
                      placeholder="About your company..."
                      className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                      <input
                        name="website" type="url" defaultValue={company?.website || ''}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input
                        name="city" defaultValue={company?.city || ''}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                      <input
                        name="industry" defaultValue={company?.industry || ''}
                        placeholder="e.g. Technology"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee Size</label>
                      <select
                        name="employee_size" defaultValue={company?.employee_size || ''}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                      >
                        <option value="">Select</option>
                        {['1-10','11-50','51-200','201-1000','1000+'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit" disabled={savingCompany}
                    className="px-6 py-2.5 text-white font-semibold rounded-lg text-sm disabled:opacity-60"
                    style={{ backgroundColor: '#1a7d4e' }}
                  >
                    {savingCompany ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ════════ REPORTS VIEW ════════ */}
          {activeView === 'reports' && (
            <div className="max-w-lg">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Reports</h1>
              <div className="bg-white rounded-xl border p-12 text-center">
                <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">This section is coming soon.</p>
              </div>
            </div>
          )}

          {/* ════════ BILLING VIEW ════════ */}
          {activeView === 'billing' && (() => {
            const filtered = billingFilter === 'all'
              ? billingHistory
              : billingHistory.filter((p) => p.status === billingFilter);
            return (
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-6">Billing</h1>

                {/* Billing profile */}
                <div className="bg-white rounded-xl border p-5 mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-1">Billing profile</h2>
                    <p className="text-sm text-gray-500">Add your registered ISD-GST or GST number and company details that would appear on your future invoices.</p>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    Add GSTIN / ISD-GSTIN
                  </button>
                </div>

                {/* ISD-GSTIN notice */}
                <div className="flex items-center justify-between gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    If you're registered with ISD-GSTIN, kindly update your GSTIN accordingly.
                  </div>
                  <button className="text-[#1a7d4e] font-medium hover:underline whitespace-nowrap text-sm">
                    Add GSTIN / ISD-GSTIN
                  </button>
                </div>

                {/* Billing history */}
                <div className="bg-white rounded-xl border">
                  <div className="p-5 border-b">
                    <h2 className="font-semibold text-gray-900 mb-4">Billing History</h2>
                    {/* Filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'success', 'pending', 'failed'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setBillingFilter(f)}
                          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors capitalize ${
                            billingFilter === f
                              ? 'border-[#1a7d4e] text-[#1a7d4e] bg-[#f0fdf4]'
                              : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {billingLoading ? (
                    <div className="p-10 text-center">
                      <div className="h-8 w-8 border-3 border-[#1a7d4e] border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                      <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No billing records found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            {['Date', 'Plan details', 'Applies until', 'Amount', 'Status', 'Action'].map((h) => (
                              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filtered.map((payment: any) => {
                            const createdAt = new Date(payment.created_at || payment.createdAt);
                            const startAt = payment.plan_start_at ? new Date(payment.plan_start_at) : null;
                            const expiresAt = payment.plan_expires_at ? new Date(payment.plan_expires_at) : null;
                            const statusColors: Record<string, string> = {
                              success: 'bg-green-100 text-green-700',
                              pending: 'bg-orange-100 text-orange-600',
                              failed: 'bg-red-100 text-red-600',
                            };
                            return (
                              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                {/* Date */}
                                <td className="px-5 py-4 align-top">
                                  <p className="font-medium text-gray-900">
                                    {createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </p>
                                </td>
                                {/* Plan details */}
                                <td className="px-5 py-4 align-top">
                                  <span className="text-[#1a7d4e] font-medium hover:underline cursor-pointer">
                                    1 Job Credit Package
                                  </span>
                                </td>
                                {/* Applies until */}
                                <td className="px-5 py-4 align-top">
                                  <p className="text-gray-700">
                                    Ordered on: {startAt
                                      ? startAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                      : createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-0.5">
                                    Expired on: {expiresAt
                                      ? expiresAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                      : 'Jan 1, 0001'}
                                  </p>
                                </td>
                                {/* Amount */}
                                <td className="px-5 py-4 align-top font-semibold text-gray-900">
                                  ₹{(payment.total_amount || 0).toLocaleString('en-IN')}
                                </td>
                                {/* Status */}
                                <td className="px-5 py-4 align-top">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    statusColors[payment.status] || 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </span>
                                </td>
                                {/* Action */}
                                <td className="px-5 py-4 align-top">
                                  {(payment.status === 'pending' || payment.status === 'failed') && payment.job_id && (
                                    <button
                                      onClick={() => {
                                        const job = jobs.find((j) => j.id === payment.job_id);
                                        if (job) handleFinishPosting(job);
                                      }}
                                      className="flex items-center gap-1.5 text-[#1a7d4e] text-sm font-medium hover:underline"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Retry payment
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="px-5 py-3 text-sm text-gray-500 border-t">
                        Showing 1–{filtered.length} of {filtered.length} results
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </main>
      </div>
    </div>
  );
};
