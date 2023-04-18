import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import AuthProvider from './contexts/auth'
import Header from './components/Header';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Header/>
        <RoutesApp/>
        <ToastContainer autoClose={3000} />
        
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
