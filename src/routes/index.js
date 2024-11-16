import { useRoutes, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import config from 'config';

export default function ThemeRoutes() {
  const { user } = useAuth();

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={user ? config.loggedInPath : config.loggedOutPath} replace />
    },
    ...(!user ? LoginRoutes : MainRoutes)
  ]);
}
