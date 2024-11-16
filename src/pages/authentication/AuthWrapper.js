import PropTypes from 'prop-types';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';

// import Logo from 'components/Logo';
// import authBackgroundImg from '../../assets/images/logo/fundo.png';
import AuthCard from './AuthCard';

const AuthWrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        ...(isMobile
          ? {}
          : {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                // backgroundImage: `url(${authBackgroundImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px)',
                zIndex: -2
              }
            })
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{
          minHeight: '100vh',
          zIndex: 1
        }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          {/* <Logo /> */}
          <h1>logo</h1>
        </Grid>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
