import { Outlet } from 'react-router-dom';
import { Box, Paper, Container, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'primary.light',
        backgroundImage: 'linear-gradient(135deg, #0466c8 0%, #0353a4 100%)',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Employee Management System
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Manage your organization's workforce efficiently
            </Typography>
          </Box>
          
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;