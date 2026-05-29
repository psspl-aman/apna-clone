import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'employer';
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // Token exists but user not yet fetched — wait for loadCurrentUser() to finish
  // This prevents a false redirect on page reload before the API call completes
  if (isAuthenticated && !user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="h-10 w-10 border-4 border-[#1a7d4e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = requiredRole === 'employer' ? '/employer/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect employers who land on candidate routes to their dashboard
    if (user?.role === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
