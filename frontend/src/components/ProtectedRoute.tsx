import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'employer';
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = requiredRole === 'employer' ? '/employer/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
