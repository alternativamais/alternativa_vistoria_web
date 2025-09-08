import { Box, Typography } from '@mui/material';

import NavGroup from './NavGroup';
import menuItem from 'menu-items';

const Navigation = () => {
  // Read allowed screens from storage; if not present, do not filter.
  let allowedScreens = [];
  try {
    const raw = localStorage.getItem('@vistoria:allowedScreens');
    allowedScreens = raw ? JSON.parse(raw) : [];
  } catch (e) {
    allowedScreens = [];
  }
  const hasAllowedScreens = Array.isArray(allowedScreens) && allowedScreens.length > 0;

  // Build a filtered copy of menu items based on allowed screens.
  const filteredItems = menuItem.items.map((group) => {
    if (group.type !== 'group') return group;
    const children = Array.isArray(group.children) ? group.children : [];
    const filteredChildren = children.filter((child) => {
      // Always show Dashboard
      if (child.id === 'dashboard' || child.title === 'Dashboard') return true;
      // If there is no allowedScreens list yet, show everything
      if (!hasAllowedScreens) return true;
      // Otherwise, show only if the screen name is allowed
      return allowedScreens.includes(child.title);
    });
    return {
      ...group,
      children: filteredChildren
    };
  });

  const navGroups = filteredItems.map((item) => {
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} />;
    } else {
      return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Fix - Navigation Group
        </Typography>
      );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
