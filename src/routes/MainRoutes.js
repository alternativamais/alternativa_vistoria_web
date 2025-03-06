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
import Correcao from 'pages/Correcao/index';
import AdminRolesPermissions from 'pages/Roles/index';
import VistoriasFerramentas from 'pages/VistoriasFerramentas/index';
import Tecnicos from 'pages/Tecnicos/index';
import Ferramentas from 'pages/Ferramentas/index';
import ChecklistVistoriaFerramentas from 'pages/ChecklistVistoriaFerramentas/index';

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
        path: 'admin/correcao',
        element: <Correcao />
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
      {
        path: 'admin/permissoes',
        element: <AdminRolesPermissions />
      },
      {
        path: 'admin/tecnicos',
        element: <Tecnicos />
      },
      {
        path: 'admin/ferramentas',
        element: <Ferramentas />
      },
      {
        path: 'admin/ferramentaschecklistvistoria',
        element: <ChecklistVistoriaFerramentas />
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

      // vistoria de ferramentas

      {
        path: 'inspetor/vistoria-ferramentas',
        element: <VistoriasFerramentas />
      },
      // outra coisa
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

export default MainRoutes;
