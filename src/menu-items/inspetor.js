import { EyeOutlined, FontColorsOutlined } from '@ant-design/icons';

const inspetor = {
  id: 'group-dashboard',
  title: 'Inspetor',
  type: 'group',
  children: [
    {
      id: 'inspvistorias',
      title: 'Inspetor Vistorias',
      type: 'item',
      url: '/inspetor/vistorias',
      icon: EyeOutlined,
      breadcrumbs: false
    },
    {
      id: 'atendimentos',
      title: 'Atendimentos',
      type: 'item',
      url: '/inspetor/atendimentos',
      icon: FontColorsOutlined,
      breadcrumbs: false
    }
  ]
};

export default inspetor;
