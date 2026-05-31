import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { loadCurrentUser } from './features/auth/authSlice';
import { useAppDispatch } from './app/hooks';

import { HomePage } from './pages/Home';
import { EmployerLoginPage } from './pages/EmployerLogin';
import { JobsPage } from './pages/Jobs';
import { JobDetailPage } from './pages/JobDetail';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { PostJobPage } from './pages/PostJob';
import { PostJobWizard } from './pages/PostJobWizard';
import { NotFoundPage } from './pages/NotFound';
import { JobPrepPage } from './pages/JobPrep';
import { BrowseJobsPage } from './pages/BrowseJobs';
import { ContestPage } from './pages/Contest';
import { DegreePage } from './pages/Degree';
import { ResumeToolPage } from './pages/ResumeTool';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* ── Standalone employer pages (own navbar/layout) ── */}
        <Route path="/employer/login" element={<EmployerLoginPage />} />
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute requiredRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute requiredRole="employer">
              <PostJobWizard />
            </ProtectedRoute>
          }
        />

        {/* ── All other routes with shared Navbar/Footer ── */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/browse" element={<BrowseJobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/job-prep" element={<JobPrepPage />} />
                <Route path="/contest" element={<ContestPage />} />
                <Route path="/degree" element={<DegreePage />} />
                <Route path="/resume-tool" element={<ResumeToolPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="candidate">
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
