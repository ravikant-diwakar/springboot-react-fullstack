import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);