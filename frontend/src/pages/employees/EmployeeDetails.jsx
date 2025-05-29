import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasRole } = useAuth();
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const canManageEmployees = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');
  const canDeleteEmployees = hasRole('ROLE_ADMIN');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      enqueueSnackbar('Failed to fetch employee details', { variant: 'error' });
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await employeeService.deleteEmployee(id);
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      enqueueSnackbar('Failed to delete employee', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Employee not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employees
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Employee Details
        </Typography>
        
        <Box>
          {canManageEmployees && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          
          {canDeleteEmployees && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Employee Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={employee.profileImageUrl || ''}
                alt={`${employee.firstName} ${employee.lastName}`}
                sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              
              <Typography variant="h5" align="center">
                {employee.firstName} {employee.lastName}
              </Typography>
              
              <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
                {employee.jobTitle}
              </Typography>
              
              <Chip 
                label={employee.isActive ? "Active" : "Inactive"} 
                color={employee.isActive ? "success" : "error"} 
                sx={{ mt: 1 }}
              />
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <EmailIcon color="action" sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Email" 
                    secondary={employee.email} 
                  />
                </ListItem>
                
                <ListItem>
                  <PhoneIcon color="action" sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Phone" 
                    secondary={employee.phoneNumber || 'N/A'} 
                  />
                </ListItem>
                
                <ListItem>
                  <BusinessIcon color="action" sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Department" 
                    secondary={employee.department ? employee.department.departmentName : 'N/A'} 
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Employee Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Work Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Job Title</Typography>
                    <Typography variant="body1">{employee.jobTitle}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Salary</Typography>
                    <Typography variant="body1">${employee.salary.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Hire Date</Typography>
                    <Typography variant="body1">{formatDate(employee.hireDate)}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CakeIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
                    <Typography variant="body1">{formatDate(employee.dateOfBirth)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Address</Typography>
                    <Typography variant="body1">
                      {employee.address ? (
                        <>
                          {employee.address}
                          {employee.city && `, ${employee.city}`}
                          {employee.state && `, ${employee.state}`}
                          {employee.postalCode && ` ${employee.postalCode}`}
                          {employee.country && `, ${employee.country}`}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {employee.firstName} {employee.lastName}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDetails;