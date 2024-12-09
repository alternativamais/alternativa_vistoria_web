/* eslint-disable no-unused-vars */
import { Navigate } from 'react-router-dom';

import MainLayout from 'layout/MainLayout';
import Dashboard from 'pages/Dashboard';
import Usuarios from 'pages/Usuarios';
import Vistorias from 'pages/Vistorias/index';
import Checklist from 'pages/Checklist/index';
import VistoriasInspetor from 'pages/VistoriasInspetor/index';
import Galeria from 'pages/Galeria/index';
import Veiculos from 'pages/Veiculos/index';
import Atendimentos from 'pages/Atendimentos/index';

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

      // admin
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
        path: 'admin/veiculos',
        element: <Veiculos />
      },
      {
        path: 'admin/galeria/:idvistoria',
        element: <Galeria />
      },

      // inspetor
      {
        path: 'inspetor/vistorias',
        element: <VistoriasInspetor />
      },
      {
        path: 'inspetor/atendimentos',
        element: <Atendimentos />
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

export default MainRoutes;
