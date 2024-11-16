import { DashboardOutlined, UserOutlined } from '@ant-design/icons';

const dashboard = {
  id: 'group-dashboard',
  title: 'Sistema',
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
      url: '/usuarios',
      icon: UserOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
