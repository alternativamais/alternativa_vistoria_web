import { DashboardOutlined, UserOutlined, EyeOutlined, CheckSquareOutlined } from '@ant-design/icons';

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
      id: 'checklist',
      title: 'Checklist',
      type: 'item',
      url: '/admin/checklist',
      icon: CheckSquareOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
