/* eslint-disable no-unused-vars */
import { Navigate } from 'react-router-dom';

import MainLayout from 'layout/MainLayout';
import Dashboard from 'pages/Dashboard';
import Usuarios from 'pages/Usuarios';
import Vistorias from 'pages/Vistorias/index';
import Checklist from 'pages/Checklist/index';
import VistoriasInspetor from 'pages/VistoriasInspetor/index';
import Galeria from 'pages/Galeria/index';

const MainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // admin
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'admin/usuarios',
        element: <Usuarios />
      },
      {
        path: 'admin/vistorias',
        element: <Vistorias />
      },
      {
        path: 'admin/checklist',
        element: <Checklist />
      },
      {
        path: 'inspetor/vistorias',
        element: <VistoriasInspetor />
      },
      {
        path: 'admin/galeria/:idvistoria',
        element: <Galeria />
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

export default MainRoutes;
