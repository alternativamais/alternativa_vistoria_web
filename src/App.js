import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/sistema/ScrollTop';
import { AuthProvider } from 'hooks/auth';
// import { WebSocketProvider } from 'hooks/WebSocketProvider';

const App = () => (
  <ThemeCustomization>
    {/* <WebSocketProvider> */}
    <ScrollTop>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ScrollTop>
    {/* </WebSocketProvider> */}
  </ThemeCustomization>
);

export default App;
