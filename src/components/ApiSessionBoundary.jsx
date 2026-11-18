import { useSyncExternalStore } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiEnabled } from '../api/config';
import { authSession } from '../api/session';

export default function ApiSessionBoundary({ children }) {
  const session = useSyncExternalStore(authSession.subscribe, authSession.get, () => null);
  const location = useLocation();
  const isPublic = ['/', '/welcome', '/login'].includes(location.pathname);
  if (apiEnabled && !session?.accessToken && !isPublic) return <Navigate to="/login" replace state={{ returnTo: location.pathname + location.search }} />;
  return children;
}
