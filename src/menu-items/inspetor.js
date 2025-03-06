import { EyeOutlined, FontColorsOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;
//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const inspetor = {
  id: 'group-inspetor',
  title: 'Vistoria Instalação Externo',
  type: 'group',
  children: [
    {
      id: 'inspvistorias',
      title: 'Vistorias Instalação',
      type: 'item',
      url: '/inspetor/vistorias',
      icon: EyeOutlined,
      breadcrumbs: false
    },

    {
      id: 'atendimentos',
      title: 'Atendimentos Instalação',
      type: 'item',
      url: '/inspetor/atendimentos',
      icon: FontColorsOutlined,
      breadcrumbs: false
    }
  ]
};

export default inspetor;
