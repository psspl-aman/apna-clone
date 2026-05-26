import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobById, clearSelectedJob } from '../features/jobs/jobsSlice';
import { applyToJob } from '../features/applications/applicationsSlice';
import { MapPin, Briefcase, Clock, Users, Share2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedJob: job, loading } = useAppSelector((s) => s.jobs);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { applications } = useAppSelector((s) => s.applications);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchJobById(id));
    return () => { dispatch(clearSelectedJob()); };
  }, [id]);

  const hasApplied = applications.some((a) => a.jobId === id);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply');
      return;
    }
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="bg-white border rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-500">{job.company?.name?.[0] || 'C'}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company?.name}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.city}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.jobType?.replace(/_/g, ' ')}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Min. {job.experienceMin} years</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
            ₹{job.salaryMin?.toLocaleString() || 'Not Disclosed'}{job.salaryMax ? ` - ₹${job.salaryMax.toLocaleString()}` : ''}
          </span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm capitalize">
            {job.jobType?.replace(/_/g, ' ')}
          </span>
          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
            {job.education || 'Any Education'}
          </span>
          <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm">
            {job.openings} Opening{job.openings > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {hasApplied ? (
            <button disabled className="px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Already Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Apply Now
            </button>
          )}
          <button className="p-3 border rounded-lg hover:bg-gray-50">
            <Share2 className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-600 whitespace-pre-line">
              {job.description || 'No description provided.'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
              <p className="text-sm text-gray-600">{job.company?.name}</p>
              {job.company?.city && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.company.city}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Report Job</h3>
              <p className="text-xs text-gray-500">If you find any issues with this job posting, please report it.</p>
              <button className="mt-2 text-xs text-red-500 hover:underline">Report</button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Application</h3>
            <p className="text-gray-600 mb-6">
              Apply for <strong>{job.title}</strong> at <strong>{job.company?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApply}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
