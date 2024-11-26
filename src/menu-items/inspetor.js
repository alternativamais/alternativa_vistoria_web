import { EyeOutlined } from '@ant-design/icons';

const inspetor = {
  id: 'group-dashboard',
  title: 'Inspetor',
  type: 'group',
  children: [
    {
      id: 'inspvistorias',
      title: 'Vistorias',
      type: 'item',
      url: '/inspetor/vistorias',
      icon: EyeOutlined,
      breadcrumbs: false
    }
  ]
};

export default inspetor;
