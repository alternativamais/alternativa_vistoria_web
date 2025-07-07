import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

import { MenuFoldOutlined, MenuUnfoldOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';

import { ColorModeContext } from 'context/ColorModeContext';

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const { toggleColorMode } = useContext(ColorModeContext);
  const isLight = theme.palette.mode === 'light';

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  const mainHeader = (
    <Toolbar>
      <IconButton
        disableRipple
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        sx={{
          color: 'text.primary',
          bgcolor: open ? iconBackColorOpen : iconBackColor,
          ml: { xs: 0, lg: -2 }
        }}
      >
        {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>

      <HeaderContent />

      <IconButton aria-label="toggle theme" onClick={toggleColorMode} sx={{ ml: 'auto' }} color="inherit">
        {isLight ? <BulbOutlined /> : <BulbFilled />}
      </IconButton>
    </Toolbar>
  );

  const appBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.customShadows.z1
    }
  };

  return !matchDownMD ? (
    <AppBarStyled open={open} {...appBarProps}>
      {mainHeader}
    </AppBarStyled>
  ) : (
    <AppBar {...appBarProps}>{mainHeader}</AppBar>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
