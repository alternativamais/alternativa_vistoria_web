/* eslint-disable no-unused-vars */
import { Navigate } from 'react-router-dom';

import MainLayout from 'layout/MainLayout';
import Dashboard from 'pages/Dashboard';
import Usuarios from 'pages/Usuarios';
import Vistorias from 'pages/Vistorias/index';

const MainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'usuarios',
        element: <Usuarios />
      },
      {
        path: 'vistorias',
        element: <Vistorias />
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

export default MainRoutes;
