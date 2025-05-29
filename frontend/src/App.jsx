import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import theme from './theme';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeDetails from './pages/employees/EmployeeDetails';
import EmployeeForm from './pages/employees/EmployeeForm';
import DepartmentList from './pages/departments/DepartmentList';
import DepartmentDetails from './pages/departments/DepartmentDetails';
import DepartmentForm from './pages/departments/DepartmentForm';
import NotFound from './pages/NotFound';

const App = () => {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await checkAuth();
      setAppReady(true);
    };
    initApp();
  }, [checkAuth]);

  if (loading || !appReady) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          
          {/* Employee Routes */}
          <Route path="/employees" element={isAuthenticated ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/employees/new" element={isAuthenticated ? <EmployeeForm /> : <Navigate to="/login" />} />
          <Route path="/employees/:id" element={isAuthenticated ? <EmployeeDetails /> : <Navigate to="/login" />} />
          <Route path="/employees/:id/edit" element={isAuthenticated ? <EmployeeForm /> : <Navigate to="/login" />} />
          
          {/* Department Routes */}
          <Route path="/departments" element={isAuthenticated ? <DepartmentList /> : <Navigate to="/login" />} />
          <Route path="/departments/new" element={isAuthenticated ? <DepartmentForm /> : <Navigate to="/login" />} />
          <Route path="/departments/:id" element={isAuthenticated ? <DepartmentDetails /> : <Navigate to="/login" />} />
          <Route path="/departments/:id/edit" element={isAuthenticated ? <DepartmentForm /> : <Navigate to="/login" />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;