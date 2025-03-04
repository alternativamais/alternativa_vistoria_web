import { EyeOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;
//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const vistoriaFerramentas = {
  id: 'group-vistoria-ferramentas',
  title: 'Vistoria Ferramentas',
  type: 'group',
  children: [
    {
      id: 'vistoriaferramentas',
      title: 'Vistoria Ferramentas',
      type: 'item',
      url: '/inspetor/vistoria-ferramentas',
      icon: EyeOutlined,
      breadcrumbs: false
    }
  ]
};

export default vistoriaFerramentas;
