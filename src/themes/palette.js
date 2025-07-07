// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
  const colors = presetPalettes;

  const greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000000',
        white: '#ffffff'
      },
      ...paletteColor,
      text: {
        primary: mode === 'dark' ? paletteColor.grey[200] : paletteColor.grey[700],
        secondary: mode === 'dark' ? paletteColor.grey[400] : paletteColor.grey[500],
        disabled: paletteColor.grey[400]
      },
      action: {
        disabled: paletteColor.grey[300]
      },
      divider: mode === 'dark' ? paletteColor.grey[700] : paletteColor.grey[200],
      background: {
        paper: mode === 'dark' ? paletteColor.grey[800] : paletteColor.grey[0],
        default: mode === 'dark' ? paletteColor.grey[800] : paletteColor.grey.A50
      }
    }
  });
};

export default Palette;
