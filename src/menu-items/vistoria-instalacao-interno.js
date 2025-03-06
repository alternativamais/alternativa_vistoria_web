import { EyeOutlined, CheckSquareOutlined, UndoOutlined, CarOutlined } from '@ant-design/icons';
// import { getUserDataFromToken } from 'utils/tokenUtils';

// const tokenData = getUserDataFromToken();

// const temPermissao = (grupo) => {
//   if (!tokenData) return false;
//   const { user } = tokenData;

//   return user.role.permissions.some((perm) => perm.group === grupo);
// };

const vistoriaInstalacaoInterno = {
  id: 'group-vistoria-instalacao-interno',
  title: 'Vistoria Instalação Interno',
  type: 'group',
  children: [
    {
      id: 'vistorias',
      title: 'Vistorias Instalação',
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
      id: 'checklistinstalacao',
      title: 'Checklist Instalação',
      type: 'item',
      url: '/admin/checklist',
      icon: CheckSquareOutlined,
      breadcrumbs: false
    },
    {
      id: 'veiculos',
      title: 'Veículos',
      type: 'item',
      url: '/admin/veiculos',
      icon: CarOutlined,
      breadcrumbs: false
    }
  ]
};

export default vistoriaInstalacaoInterno;
