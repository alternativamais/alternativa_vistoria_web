import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ButtonBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// import logo from '../../assets/images/logo/logo.png';
import config from 'config';
import { activeItem } from 'store/reducers/menu';
import { useAuth } from 'hooks/auth';

const LogoSection = ({ sx }) => {
  const { user } = useAuth();
  const { defaultId } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      component={Link}
      onClick={() => dispatch(activeItem({ openItem: [defaultId] }))}
      to={user ? config.loggedInPath : config.loggedOutPath}
      sx={sx}
    >
      {/* <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} /> */}
      <h1>colocar logo</h1>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
