import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/sistema/ScrollTop';
import { AuthProvider } from 'hooks/auth';

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
