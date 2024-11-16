import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'components/sistema/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));

const LoginRoutes = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <AuthLogin />
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
];

export default LoginRoutes;
