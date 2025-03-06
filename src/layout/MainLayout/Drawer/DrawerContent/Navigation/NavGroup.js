import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Box, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import NavItem from './NavItem';

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;
  const location = useLocation();
  const currentPath = location.pathname;

  const isChildActive = (children) => {
    if (!children) return false;
    return children.some((child) => {
      if (child.selected) return true;
      if (child.url && child.url === currentPath) return true;
      if (child.children) return isChildActive(child.children);
      return false;
    });
  };

  const initialOpen = isChildActive(item.children);
  const [open, setOpen] = useState(initialOpen);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Box key={menuItem.id} sx={{ pl: 4, py: 0.5 }}>
            <ListItemText
              primary="collapse - only available in paid version"
              primaryTypographyProps={{ variant: 'caption', color: 'error' }}
            />
          </Box>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Box key={menuItem.id} sx={{ pl: 4, py: 0.5 }}>
            <ListItemText
              primary="Fix - Group Collapse or Items"
              primaryTypographyProps={{ variant: 'h6', color: 'error', textAlign: 'center' }}
            />
          </Box>
        );
    }
  });

  return (
    <List disablePadding>
      {item.title && drawerOpen && (
        <ListItemButton onClick={handleToggle}>
          <ListItemText primary={item.title} primaryTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }} />
          {open ? <DownOutlined /> : <RightOutlined />}
        </ListItemButton>
      )}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {navCollapse}
      </Collapse>
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
