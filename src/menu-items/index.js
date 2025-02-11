import dashboard from './dashboard';
import inspetor from './inspetor';

const menuItems = {
  items: [dashboard, inspetor].filter((item) => Array.isArray(item.children) && item.children.length > 0)
};

export default menuItems;
