import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

const AuthTokenFilter = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      navigate('/login');
      enqueueSnackbar('Please log in to access this page', { variant: 'info' });
    } else if (token) {
      checkAuth();
    }
  }, []);

  return children;
};

export default AuthTokenFilter;