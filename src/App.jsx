import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './components/Navbar';

function App() {
  const location = useLocation();
  const hideNavBar = ['/login', '/signup'].includes(location.pathname);

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <Outlet />
    </div>
  );
}

export default App;