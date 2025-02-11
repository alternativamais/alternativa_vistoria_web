import { DashboardOutlined, UserOutlined, EyeOutlined, CheckSquareOutlined, CarOutlined, UndoOutlined } from '@ant-design/icons';
import { getUserDataFromToken } from 'utils/tokenUtils';

const tokenData = getUserDataFromToken();

const temPermissao = (grupo) => {
  if (!tokenData) return false;
  const { user } = tokenData;

  return user.role.permissions.some((perm) => perm.group === grupo);
};

const dashboard = {
  id: 'group-dashboard',
  title: 'Admin',
  type: 'group',
  children: [
    ...(temPermissao('dashboard')
      ? [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: DashboardOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('usuario')
      ? [
          {
            id: 'usuarios',
            title: 'Usuários',
            type: 'item',
            url: '/admin/usuarios',
            icon: UserOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('vistoria')
      ? [
          {
            id: 'vistorias',
            title: 'Vistorias',
            type: 'item',
            url: '/admin/vistorias',
            icon: EyeOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('imagens correcao')
      ? [
          {
            id: 'correcao',
            title: 'Correção de Vistorias',
            type: 'item',
            url: '/admin/correcao',
            icon: UndoOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('checklist')
      ? [
          {
            id: 'checklist',
            title: 'Checklist',
            type: 'item',
            url: '/admin/checklist',
            icon: CheckSquareOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('veiculos')
      ? [
          {
            id: 'veiculos',
            title: 'Veículos',
            type: 'item',
            url: '/admin/veiculos',
            icon: CarOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('permissao')
      ? [
          {
            id: 'permissoes',
            title: 'Permissões',
            type: 'item',
            url: '/admin/permissoes',
            icon: CarOutlined,
            breadcrumbs: false
          }
        ]
      : [])
  ]
};

export default dashboard;
