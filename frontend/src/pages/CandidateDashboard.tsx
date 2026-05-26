import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyApplications } from '../features/applications/applicationsSlice';
import { User, Briefcase, FileText, Settings, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  applied: 'bg-gray-100 text-gray-700',
  shortlisted: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-green-100 text-green-700',
};

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'applications', label: 'My Applications', icon: Briefcase },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { applications } = useAppSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const handleResumeUpload = () => {
    toast.success('Resume upload feature will be available when backend is connected');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border rounded-xl p-5 text-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900">Candidate</h3>
            <p className="text-sm text-gray-500">Complete your profile</p>
            <div className="mt-3 bg-gray-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">60% complete</p>
          </div>

          <nav className="bg-white border rounded-xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <form className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="0" />
                </div>
                <button type="button" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Applications</h2>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{app.job?.title}</p>
                        <p className="text-sm text-gray-500">{app.job?.company?.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Resume</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your resume here</p>
                <p className="text-sm text-gray-400 mb-4">PDF, DOC, DOCX (Max 5MB)</p>
                <button onClick={handleResumeUpload} className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600">
                  Upload Resume
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <p className="text-gray-500">Account settings and preferences will be available here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
