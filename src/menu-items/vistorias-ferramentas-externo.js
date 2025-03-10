import { EyeOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;
//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const vistoriaInstalacaoExterno = {
  id: 'group-vistoria-ferramentas',
  title: 'Vistoria Instalação Externo',
  type: 'group',
  children: [
    {
      id: 'vistoriaferramentasexterno',
      title: 'Vistoria Ferramentas Externo',
      type: 'item',
      url: 'inspetor/vistoria-ferramentas-externo',
      icon: EyeOutlined,
      breadcrumbs: false
    }
  ]
};

export default vistoriaInstalacaoExterno;
