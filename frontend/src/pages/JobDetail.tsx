import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobById, clearSelectedJob, fetchJobs } from '../features/jobs/jobsSlice';
import { applyToJob } from '../features/applications/applicationsSlice';
import { MapPin, Share2, ChevronRight, Zap, Users, CheckCircle, Building2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const LOGO_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-600', 'bg-orange-500',
  'bg-purple-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500',
];

function formatSalary(val?: number) {
  if (!val) return 'Not Disclosed';
  return '\u20b9' + val.toLocaleString('en-IN');
}

function getJobTypeBadge(type: string) {
  const map: Record<string, string> = {
    full_time: 'Full Time', part_time: 'Part Time',
    work_from_home: 'Work from Home', night_shift: 'Night Shift',
  };
  return map[type] || type?.replace(/_/g, ' ');
}

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedJob: job, loading, jobs: similarJobs } = useAppSelector((s) => s.jobs);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { applications } = useAppSelector((s) => s.applications);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchJobById(id));
    return () => { dispatch(clearSelectedJob()); };
  }, [id]);

  // Fetch similar jobs based on city/category when job loads
  useEffect(() => {
    if (job) {
      dispatch(fetchJobs({ city: job.city, limit: 4, page: 1 }));
    }
  }, [job?.id]);

  const hasApplied = applications.some((a) => a.jobId === id);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (user?.role !== 'candidate') { toast.error('Only candidates can apply'); return; }
    setShowConfirm(true);
  };

  const confirmApply = async () => {
    if (!id) return;
    const result = await dispatch(applyToJob(id));
    if (applyToJob.fulfilled.match(result)) {
      toast.success('Application submitted!');
      setShowConfirm(false);
    } else {
      toast.error(result.payload as string);
      setShowConfirm(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
              <div className="bg-white rounded-lg p-4 h-48 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const logoColor = LOGO_COLORS[job.title?.charCodeAt(0) % LOGO_COLORS.length] || 'bg-blue-500';
  const filteredSimilar = similarJobs.filter((j) => j.id !== job.id).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link to="/jobs" className="hover:text-primary">Jobs</Link>
            <ChevronRight className="h-3 w-3" />
            {job.city && <><span className="hover:text-primary cursor-pointer">{job.city}</span><ChevronRight className="h-3 w-3" /></>}
            <span className="text-gray-800 font-medium">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* ── Left: Main Content ── */}
          <div className="space-y-3">

            {/* Job Header Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 ${logoColor} rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl`}>
                  {(job.company?.name?.[0] || 'C').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h1>
                  <Link to="#" className="text-sm text-primary hover:underline mt-0.5 block">{job.company?.name}</Link>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.city}</span>
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
                  <div className="mt-2 grid grid-cols-2 border border-gray-200 rounded text-sm w-64">
                    <div className="p-2.5 border-r border-gray-200">
                      <div className="text-xs text-gray-500">Fixed</div>
                      <div className="font-semibold text-gray-800 text-xs mt-0.5">
                        {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                      </div>
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs text-gray-500">Earning Potential</div>
                      <div className="font-semibold text-gray-800 text-xs mt-0.5">{formatSalary(job.salaryMax)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.workLocationType && (
                  <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                    {job.workLocationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                  {getJobTypeBadge(job.jobType)}
                </span>
                <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full">
                  {job.experienceMin === 0 ? 'Freshers only' : `${job.experienceMin}+ years exp`}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4">
                {hasApplied ? (
                  <button disabled className="flex-1 sm:flex-none px-8 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-semibold text-sm cursor-not-allowed">
                    Already Applied
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    className="flex-1 sm:flex-none px-8 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors"
                  >
                    Apply for job
                  </button>
                )}
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm text-gray-600">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            {/* Job Highlights */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-3">Job highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                  <Zap className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">Urgently hiring</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">Fast HR reply</div>
                    <div className="text-xs text-gray-500 mt-0.5">HR responds quickly to candidates</div>
                  </div>
                </div>
              </div>
              {(job as any).applicantCount !== undefined && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span><strong>{(job as any).applicantCount}</strong> applicant{(job as any).applicantCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Job Role */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">Job role</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Department</div>
                  <div className="font-medium text-gray-800">{job.department || job.category?.replace(/_/g, ' ') || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Role / Category</div>
                  <div className="font-medium text-gray-800">{job.category?.replace(/_/g, ' ') || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Employment type</div>
                  <div className="font-medium text-gray-800 capitalize">{getJobTypeBadge(job.jobType)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Shift</div>
                  <div className="font-medium text-gray-800">{job.isNightShift ? 'Night Shift' : 'Day Shift'}</div>
                </div>
              </div>
            </div>

            {/* Job Requirements */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">Job requirements</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Experience</div>
                  <div className="font-medium text-gray-800">
                    {job.experienceMin === 0 ? 'Freshers only' : `${job.experienceMin}${job.experienceMax ? ` - ${job.experienceMax}` : '+'} years`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Education</div>
                  <div className="font-medium text-gray-800 capitalize">{job.education || 'Any'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Skills</div>
                  <div className="font-medium text-gray-800">{job.description?.split(' ').slice(0, 8).join(', ') || 'As per role requirement'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Gender</div>
                  <div className="font-medium text-gray-800 capitalize">{job.gender === 'any' || !job.gender ? 'Any gender' : job.gender}</div>
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-gray-900 mb-4">About company</h2>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 ${logoColor} rounded flex-shrink-0 flex items-center justify-center text-white font-bold`}>
                  {(job.company?.name?.[0] || 'C').toUpperCase()}
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name</span>
                      <div className="font-medium text-gray-800">{job.company?.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Address</span>
                      <div className="font-medium text-gray-800">{job.company?.city || 'Not specified'}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Job posted by{' '}
                    <span className="text-primary font-medium">{job.company?.name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">FAQs about this job</h2>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  Show all <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  `Is ${job.company?.name} hiring for ${job.title}?`,
                  `What is the salary offered for ${job.title} at ${job.company?.name}?`,
                  `What is the minimum qualification for this ${job.title} role?`,
                ].map((q, i) => (
                  <details key={i} className="group">
                    <summary className="text-sm text-gray-700 cursor-pointer py-2 border-b border-gray-100 flex items-center justify-between list-none">
                      {q}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-xs text-gray-500 pt-2 pb-1 pl-2">
                      Please visit the job details or contact the employer directly for this information.
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-3">

            {/* Get your dream job steps */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Get your dream job in 3 simple steps:</h3>
              <div className="flex items-center gap-1 text-xs">
                {['Apply for job', 'Create profile', 'Schedule interview', 'Get hired'].map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 text-center leading-tight w-12">{step}</span>
                    </div>
                    {i < 3 && <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0 -mt-3" />}
                  </div>
                ))}
              </div>
              <button
                onClick={handleApply}
                className="mt-4 w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-600"
              >
                Apply for job
              </button>
            </div>

            {/* Similar jobs */}
            {filteredSimilar.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Similar jobs</h3>
                <div className="space-y-3">
                  {filteredSimilar.map((sj, idx) => (
                    <Link
                      key={sj.id}
                      to={`/jobs/${sj.id}`}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 border border-gray-100"
                    >
                      <div className={`h-9 w-9 ${LOGO_COLORS[idx % LOGO_COLORS.length]} rounded flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                        {(sj.company?.name?.[0] || 'C').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{sj.title}</div>
                        <div className="text-xs text-gray-500 truncate">{sj.company?.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="h-3 w-3" /><span>{sj.city}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{getJobTypeBadge(sj.jobType)}</span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{sj.experienceMin === 0 ? 'Freshers' : `${sj.experienceMin}+ yrs`}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
                <Link to="/jobs" className="block text-center text-xs text-primary mt-3 hover:underline">Show more jobs</Link>
              </div>
            )}

            {/* Login with Apna */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Login with Apna and experience more!</h3>
              <ul className="space-y-2 text-xs text-gray-600 mt-3">
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold text-sm">✓</span> Personalised job matches</li>
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold text-sm">✓</span> Direct connect with HRs</li>
                <li className="flex items-center gap-1.5"><span className="text-primary font-bold text-sm">✓</span> Latest updates on the job</li>
              </ul>
              <div className="mt-3 bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 text-xs">📱 App Preview</div>
              <Link
                to="/register"
                className="block mt-3 w-full bg-primary text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-primary-600"
              >
                Create profile &rsaquo;
              </Link>
            </div>

            {/* Company info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-800">{job.company?.name}</span>
              </div>
              {job.company?.city && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /><span>{job.company.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Apply Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>
            <p className="text-gray-600 mb-6">
              Apply for <strong>{job.title}</strong> at <strong>{job.company?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmApply} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
