import { BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'
import AuthProvider from './contexts/auth'
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Header/>
        <RoutesApp/>
        
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
