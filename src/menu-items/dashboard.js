import { DashboardOutlined, UserOutlined, EyeOutlined, CheckSquareOutlined, CarOutlined, UndoOutlined } from '@ant-design/icons';

const dashboard = {
  id: 'group-dashboard',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      type: 'item',
      url: '/admin/usuarios',
      icon: UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'vistorias',
      title: 'Vistorias',
      type: 'item',
      url: '/admin/vistorias',
      icon: EyeOutlined,
      breadcrumbs: false
    },
    {
      id: 'correcao',
      title: 'Correção de Vistorias',
      type: 'item',
      url: '/admin/correcao',
      icon: UndoOutlined,
      breadcrumbs: false
    },
    {
      id: 'checklist',
      title: 'Checklist',
      type: 'item',
      url: '/admin/checklist',
      icon: CheckSquareOutlined,
      breadcrumbs: false
    },
    {
      id: 'veiculos',
      title: 'Veiculos',
      type: 'item',
      url: '/admin/veiculos',
      icon: CarOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
