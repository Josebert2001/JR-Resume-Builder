import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-resume-light dark:bg-gray-900">
        <LoadingSpinner text="Authenticating..." size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page while preserving the intended destination
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}