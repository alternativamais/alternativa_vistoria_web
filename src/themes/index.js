import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

import { ColorModeContext } from 'context/ColorModeContext';

export default function ThemeCustomization({ children }) {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      }
    }),
    []
  );

  const themePalette = Palette(mode, 'default');

  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(themePalette), [themePalette]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1536 }
      },
      direction: 'ltr',
      mixins: {
        toolbar: { minHeight: 60, paddingTop: 8, paddingBottom: 8 }
      },
      palette: themePalette.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [themePalette, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ColorModeContext.Provider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node
};
