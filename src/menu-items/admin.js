import { DashboardOutlined, UserOutlined, UnlockOutlined, EyeOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;

//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const admin = {
  id: 'group-admin',
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
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/admin/logs',
      icon: EyeOutlined,
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
      id: 'permissoes',
      title: 'Permissões',
      type: 'item',
      url: '/admin/permissoes',
      icon: UnlockOutlined,
      breadcrumbs: false
    }
  ]
};

export default admin;
