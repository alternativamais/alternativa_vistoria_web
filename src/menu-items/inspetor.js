import { EyeOutlined, FontColorsOutlined } from '@ant-design/icons';
import { getUserDataFromToken } from 'utils/tokenUtils';

const tokenData = getUserDataFromToken();

const temPermissao = (grupo) => {
  if (!tokenData) return false;
  const { user } = tokenData;
  return user.role.permissions.some((perm) => perm.group === grupo);
};

const inspetor = {
  id: 'group-inspetor',
  title: 'Inspetor',
  type: 'group',
  children: [
    ...(temPermissao('vistoria')
      ? [
          {
            id: 'inspvistorias',
            title: 'Inspetor Vistorias',
            type: 'item',
            url: '/inspetor/vistorias',
            icon: EyeOutlined,
            breadcrumbs: false
          }
        ]
      : []),

    ...(temPermissao('atendimentos')
      ? [
          {
            id: 'atendimentos',
            title: 'Atendimentos',
            type: 'item',
            url: '/inspetor/atendimentos',
            icon: FontColorsOutlined,
            breadcrumbs: false
          }
        ]
      : [])
  ]
};

export default inspetor;
