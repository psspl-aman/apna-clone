import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';
import { Briefcase, Plus, Building, Settings, LogOut, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'jobs', label: 'My Jobs', icon: Briefcase },
  { id: 'post', label: 'Post a Job', icon: Plus },
  { id: 'company', label: 'Company Profile', icon: Building },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border rounded-xl p-5 text-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900">{user?.email || 'Employer'}</h3>
            <p className="text-sm text-gray-500">Employer Account</p>
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

        <div className="flex-1">
          {activeTab === 'jobs' && (
            <div className="bg-white border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Jobs</h2>
                <button
                  onClick={() => setActiveTab('post')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                >
                  <Plus className="h-4 w-4" /> Post New Job
                </button>
              </div>
              <div className="text-center py-16">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs posted yet</p>
                <button
                  onClick={() => setActiveTab('post')}
                  className="mt-3 text-primary font-medium text-sm hover:underline"
                >
                  Post your first job
                </button>
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Post a New Job</h2>
              <form className="space-y-4 max-w-2xl" onSubmit={(e) => { e.preventDefault(); toast.success('Job posted! (Backend integration required)'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input type="text" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Sales Executive" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2 border rounded-lg">
                      <option>Sales</option>
                      <option>Telecalling</option>
                      <option>Delivery</option>
                      <option>Driver</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select className="w-full px-4 py-2 border rounded-lg">
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="work_from_home">Work From Home</option>
                      <option value="night_shift">Night Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="10000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="25000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Min (years)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Max</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="10th/12th/Graduate" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Openings</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea rows={5} className="w-full px-4 py-2 border rounded-lg" placeholder="Describe the role..."></textarea>
                </div>
                <button type="submit" className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600">
                  Publish Job
                </button>
              </form>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h2>
              <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); toast.success('Company profile updated!'); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-lg" placeholder="About your company..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" className="w-full px-4 py-2 border rounded-lg" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Technology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Size</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-1000</option>
                    <option>1000+</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <p className="text-gray-500">Account settings will be available here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
