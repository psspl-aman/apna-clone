import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobById, clearSelectedJob, fetchJobs } from '../features/jobs/jobsSlice';
import { applyToJob } from '../features/applications/applicationsSlice';
import { MapPin, Share2, ChevronRight, Zap, Users, CheckCircle, Building2, Briefcase, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Job } from '../types';

const LOGO_COLORS = [
  'bg-red-500', 'bg-blue-600', 'bg-green-600', 'bg-orange-500',
  'bg-purple-600', 'bg-teal-600', 'bg-indigo-600', 'bg-pink-600',
];

function formatSalary(val?: number) {
  if (!val) return 'Not Disclosed';
  return '₹' + val.toLocaleString('en-IN');
}

function getJobTypeBadge(type?: string) {
  if (!type) return 'Not specified';
  const map: Record<string, string> = {
    full_time: 'Full Time', part_time: 'Part Time',
    work_from_home: 'Work from Home', night_shift: 'Night Shift',
  };
  return map[type] || type.replace(/_/g, ' ');
}

function getWorkLocationBadge(type?: string) {
  if (!type) return null;
  const map: Record<string, string> = {
    work_from_office: 'Work from Office',
    work_from_home: 'Work from Home',
    field_job: 'Field Job',
  };
  return map[type] || type.replace(/_/g, ' ');
}

function getEnglishLabel(level?: string) {
  if (!level || level === 'no_english') return 'No English';
  if (level === 'basic_english') return 'Basic English';
  if (level === 'good_english') return 'Good (Intermediate / Advanced) English';
  return level.replace(/_/g, ' ');
}

function getExperienceLabel(job: Job) {
  const type = job.experienceType;
  if (type === 'fresher_only' || job.experienceMin === 0) return 'Freshers only';
  if (type === 'any' || !type) return 'Any experience';
  return `${job.experienceMin || 0}${job.experienceMax ? ` - ${job.experienceMax}` : '+'} years`;
}

function getEducationLabel(edu?: string) {
  if (!edu) return 'Any';
  const map: Record<string, string> = {
    '10th': '10th or Below 10th', '12th': '12th Pass',
    diploma: 'Diploma', graduate: 'Graduate', post_graduate: 'Post Graduate',
  };
  return map[edu] || edu;
}

function logoColor(name?: string) {
  return LOGO_COLORS[(name?.charCodeAt(0) || 0) % LOGO_COLORS.length];
}

function SimilarJobCard({ job, idx }: { job: Job; idx: number }) {
  return (
    <Link to={`/jobs/${job.id}`} className="flex items-start gap-2.5 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className={`h-10 w-10 ${LOGO_COLORS[idx % LOGO_COLORS.length]} rounded flex-shrink-0 flex items-center justify-center text-white font-bold text-sm`}>
        {(job.company?.name?.[0] || 'C').toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-800 truncate">{job.title}</div>
        <div className="text-xs text-gray-500 truncate">{job.company?.name}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <MapPin className="h-3 w-3 flex-shrink-0" /><span className="truncate">{job.city}</span>
        </div>
        <div className="text-xs font-medium text-gray-700 mt-0.5">
          {formatSalary(job.salaryMin)}{job.salaryMax ? ` - ${formatSalary(job.salaryMax)}` : ''}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {getWorkLocationBadge(job.workLocationType) && (
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{getWorkLocationBadge(job.workLocationType)}</span>
          )}
          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{getJobTypeBadge(job.jobType)}</span>
          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{getExperienceLabel(job)}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
    </Link>
  );
}

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedJob: job, loading, jobs: similarJobs } = useAppSelector((s) => s.jobs);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { applications } = useAppSelector((s) => s.applications);
  const [showConfirm, setShowConfirm] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchJobById(id));
    return () => { dispatch(clearSelectedJob()); };
  }, [id]);

  useEffect(() => {
    if (job) dispatch(fetchJobs({ city: job.city, limit: 4, page: 1 }));
  }, [job?.id]);

  const hasApplied = applications.some((a) => a.jobId === id);

  const handleApply = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } }); return; }
    if (user?.role !== 'candidate') { toast.error('Only candidates can apply'); return; }
    setShowConfirm(true);
  };

  const confirmApply = async () => {
    if (!id) return;
    const result = await dispatch(applyToJob(id));
    if (applyToJob.fulfilled.match(result)) { toast.success('Application submitted!'); setShowConfirm(false); }
    else { toast.error(result.payload as string); setShowConfirm(false); }
  };

  if (loading || !job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
              <div className="bg-white rounded-lg p-6 h-32" />
            </div>
            <div className="bg-white rounded-lg p-4 h-64" />
          </div>
        </div>
      </div>
    );
  }

  const lc = logoColor(job.company?.name);
  const filtered = similarJobs.filter((j) => j.id !== job.id).slice(0, 3);
  const descFull = job.description || '';
  const needsExpand = descFull.length > 350;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/jobs" className="hover:text-primary">Jobs</Link>
          <ChevronRight className="h-3 w-3" />
          {job.city && <><Link to={`/jobs?city=${job.city}`} className="hover:text-primary">{job.city}</Link><ChevronRight className="h-3 w-3" /></>}
          <span className="text-gray-700 font-medium truncate max-w-xs">{job.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* LEFT PANEL */}
          <div className="space-y-3">

            {/* Job Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 ${lc} rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl`}>
                  {(job.company?.name?.[0] || 'C').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h1>
                  <p className="text-sm text-primary font-medium mt-0.5">{job.company?.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" /><span>{job.city}</span>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-800">
                  {formatSalary(job.salaryMin)}{job.salaryMax ? ` - ${formatSalary(job.salaryMax)}` : ''}
                  <span className="font-normal text-gray-500 ml-1 text-xs">monthly</span>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className="mt-2 inline-grid grid-cols-2 border border-gray-200 rounded text-xs overflow-hidden">
                    <div className="p-2.5 border-r border-gray-200">
                      <div className="text-gray-500 mb-0.5">Fixed</div>
                      <div className="font-semibold text-gray-800">{formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}</div>
                    </div>
                    <div className="p-2.5">
                      <div className="text-gray-500 mb-0.5">Earning Potential</div>
                      <div className="font-semibold text-gray-800">{formatSalary(job.salaryMax)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {getWorkLocationBadge(job.workLocationType) && (
                  <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                    {getWorkLocationBadge(job.workLocationType)}
                  </span>
                )}
                <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                  {getJobTypeBadge(job.jobType)}
                </span>
                <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                  {getExperienceLabel(job)}
                </span>
                {job.englishLevel && job.englishLevel !== 'no_english' && (
                  <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full max-w-[200px] truncate">
                    {getEnglishLabel(job.englishLevel)}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 mt-4">
                {hasApplied ? (
                  <button disabled className="px-8 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-semibold text-sm cursor-not-allowed">Applied ✓</button>
                ) : (
                  <button onClick={handleApply} className="px-8 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors">
                    Apply for job
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            {/* Job Highlights */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-3">Job highlights</h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                  <Zap className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-800">Urgently hiring</span>
                </div>
                {(job as any).applicantCount !== undefined && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-800">{(job as any).applicantCount} applicants</span>
                  </div>
                )}
              </div>
              {job.perks && job.perks.length > 0 && (
                <div className="mt-3 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700">
                    <span className="font-semibold">Benefits include: </span>{job.perks.join(', ')}
                  </div>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-3">Job Description</h2>
              {job.company?.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Company Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{job.company.description}</p>
                </div>
              )}
              <div>
                {job.company?.description && (
                  <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Role Description</h3>
                )}
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {descExpanded || !needsExpand ? descFull : `${descFull.slice(0, 350)}...`}
                </div>
                {!descFull && <p className="text-sm text-gray-400 italic">No description provided.</p>}
                {needsExpand && (
                  <button onClick={() => setDescExpanded(!descExpanded)} className="text-sm text-primary font-medium mt-2 hover:underline">
                    {descExpanded ? 'Show less ▲' : 'Show more ▼'}
                  </button>
                )}
              </div>
            </div>

            {/* Job Role */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">Job role</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.workLocationType && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Work location</div>
                      <div className="text-sm font-medium text-gray-800">
                        {getWorkLocationBadge(job.workLocationType)}{job.city && ` · ${job.city}`}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Department</div>
                    <div className="text-sm font-medium text-gray-800">{job.department || job.category?.replace(/_/g, ' ') || '—'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Role / Category</div>
                    <div className="text-sm font-medium text-gray-800 capitalize">{job.category?.replace(/_/g, ' ') || '—'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Employment type</div>
                    <div className="text-sm font-medium text-gray-800">{getJobTypeBadge(job.jobType)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Shift</div>
                    <div className="text-sm font-medium text-gray-800">{job.isNightShift ? 'Night Shift' : 'Day Shift'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Requirements */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">Job requirements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 text-sm">👤</span>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Experience</div>
                    <div className="text-sm font-medium text-gray-800">{getExperienceLabel(job)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 text-sm">🎓</span>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Education</div>
                    <div className="text-sm font-medium text-gray-800">{getEducationLabel(job.education)}</div>
                  </div>
                </div>
                {job.englishLevel && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5 text-sm">💬</span>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">English level</div>
                      <div className="text-sm font-medium text-gray-800">{getEnglishLabel(job.englishLevel)}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 text-sm">👥</span>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Gender</div>
                    <div className="text-sm font-medium text-gray-800 capitalize">
                      {job.gender === 'any' || !job.gender ? 'Any gender' : job.gender}
                    </div>
                  </div>
                </div>
              </div>
              {job.skills && job.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Skills required</div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((sk) => (
                      <span key={sk} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">{sk}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Company */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">About company</h2>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 ${lc} rounded flex-shrink-0 flex items-center justify-center text-white font-bold text-sm`}>
                  {(job.company?.name?.[0] || 'C').toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5"><Building2 className="h-3 w-3" /> Name</div>
                      <div className="font-medium text-gray-800">{job.company?.name}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5"><MapPin className="h-3 w-3" /> Address</div>
                      <div className="font-medium text-gray-800">{job.company?.city || 'Not specified'}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Job posted by <span className="text-primary font-medium">{job.company?.name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900">FAQs about this job</h2>
                <button className="text-sm text-primary hover:underline">Show all ▼</button>
              </div>
              <div className="space-y-0">
                {[
                  `Is ${job.company?.name} hiring for ${job.title}?`,
                  `What is the salary for ${job.title} at ${job.company?.name}?`,
                  `What is the minimum qualification required?`,
                  `Is this a work from home job?`,
                ].map((q, i) => (
                  <details key={i} className="group border-b border-gray-100 last:border-0">
                    <summary className="flex items-center justify-between py-2.5 cursor-pointer list-none text-sm text-gray-700 hover:text-primary">
                      {q}
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-xs text-gray-500 pb-2.5 pl-1">Contact the employer directly for detailed information.</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-3">

            {/* 3-step card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Get your dream job in 3 simple steps:</h3>
              <div className="flex items-start gap-0.5">
                {['Apply for job', 'Create profile', 'Schedule interview', 'Get hired'].map((step, i, arr) => (
                  <div key={i} className="flex items-start flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{i + 1}</div>
                      <span className="text-[9px] text-gray-600 text-center leading-tight mt-1 px-0.5 break-words w-full">{step}</span>
                    </div>
                    {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0 mt-2.5" />}
                  </div>
                ))}
              </div>
              <button onClick={handleApply} disabled={hasApplied}
                className="mt-4 w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-500">
                {hasApplied ? 'Applied ✓' : 'Apply for job'}
              </button>
            </div>

            {/* Similar jobs */}
            {filtered.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Similar jobs</h3>
                <div className="space-y-2">
                  {filtered.map((sj, idx) => <SimilarJobCard key={sj.id} job={sj} idx={idx} />)}
                </div>
                <Link to={`/jobs?city=${job.city}`} className="block text-center text-xs text-primary mt-3 hover:underline font-medium">
                  Show more ›
                </Link>
              </div>
            )}

            {/* Download Apna app */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Download Apna app</h3>
              <ul className="space-y-1.5 text-xs text-gray-600 mb-3">
                <li className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Unlimited job applications</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Connect with HRs directly</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Track your applications</li>
              </ul>
              <div className="flex items-center gap-4 mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center gap-0.5 justify-center">
                    {[1,2,3,4].map((s) => <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                    <Star className="h-3 w-3 text-yellow-300 fill-yellow-200" />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">4.4 · 5L reviews</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">1 cr+</div>
                  <div className="text-[10px] text-gray-500">App downloads</div>
                </div>
              </div>
              <div className="flex gap-2">
                <a href="#" className="flex-1 flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                  <span className="text-base">🍎</span>
                  <div>
                    <div className="text-[9px] text-gray-400 leading-tight">Download on the</div>
                    <div className="text-xs font-semibold text-gray-800 leading-tight">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex-1 flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                  <span className="text-base">▶</span>
                  <div>
                    <div className="text-[9px] text-gray-400 leading-tight">Get it on</div>
                    <div className="text-xs font-semibold text-gray-800 leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Apply Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>
            <p className="text-gray-600 mb-1 text-sm">Apply for <strong>{job.title}</strong> at <strong>{job.company?.name}</strong>?</p>
            {job.city && <p className="text-xs text-gray-500 mb-5">📍 {job.city}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={confirmApply} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 text-sm font-medium">Confirm Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
