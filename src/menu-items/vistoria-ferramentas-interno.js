import { UserSwitchOutlined, ToolOutlined, CheckSquareOutlined, EyeOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;

//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const vistoriaFerramentasInterno = {
  id: 'vistoria-ferramentas-interno',
  title: 'Vistoria Ferramentas Interno',
  type: 'group',
  children: [
    {
      id: 'tecnicos',
      title: 'Técnicos',
      type: 'item',
      url: '/admin/tecnicos',
      icon: UserSwitchOutlined,
      breadcrumbs: false
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas',
      type: 'item',
      url: '/admin/ferramentas',
      icon: ToolOutlined,
      breadcrumbs: false
    },
    {
      id: 'checklistferramentas',
      title: 'Checklist Ferramentas',
      type: 'item',
      url: '/admin/ferramentaschecklistvistoria',
      icon: CheckSquareOutlined,
      breadcrumbs: false
    },
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

export default vistoriaFerramentasInterno;
