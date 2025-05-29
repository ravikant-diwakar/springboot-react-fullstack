import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import departmentService from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasRole } = useAuth();
  
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isAdmin = hasRole('ROLE_ADMIN');

  useEffect(() => {
    fetchDepartmentAndEmployees();
  }, [id]);

  const fetchDepartmentAndEmployees = async () => {
    try {
      setLoading(true);
      const [departmentData, employeesData] = await Promise.all([
        departmentService.getDepartmentById(id),
        departmentService.getEmployeesByDepartment(id)
      ]);
      
      setDepartment(departmentData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching department details:', error);
      enqueueSnackbar('Failed to fetch department details', { variant: 'error' });
      navigate('/departments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/departments/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await departmentService.deleteDepartment(id);
      enqueueSnackbar('Department deleted successfully', { variant: 'success' });
      navigate('/departments');
    } catch (error) {
      console.error('Error deleting department:', error);
      enqueueSnackbar('Failed to delete department. Make sure it has no employees assigned.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!department) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Department not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/departments')}
          sx={{ mt: 2 }}
        >
          Back to Departments
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Department Details
        </Typography>
        
        {isAdmin && (
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Department Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'secondary.main' }}
              >
                <BusinessIcon sx={{ fontSize: 50 }} />
              </Avatar>
              
              <Typography variant="h5" align="center" gutterBottom>
                {department.departmentName}
              </Typography>
              
              <Chip 
                icon={<GroupIcon />}
                label={`${employees.length} Employees`} 
                color="primary" 
                sx={{ mt: 1 }}
              />
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light' }}>
                      <LocationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Location" 
                    secondary={department.location || 'Not specified'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light' }}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Description" 
                    secondary={department.description || 'No description available'} 
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Employees in Department */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Employees in this Department
            </Typography>
            
            {employees.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'primary.light' }}>
                              <PersonIcon />
                            </Avatar>
                            {employee.firstName} {employee.lastName}
                          </Box>
                        </TableCell>
                        <TableCell>{employee.jobTitle}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={employee.isActive ? "Active" : "Inactive"} 
                            color={employee.isActive ? "success" : "error"} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No employees in this department
                </Typography>
              </Box>
            )}
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
            Are you sure you want to delete the "{department.departmentName}" department? 
            {employees.length > 0 ? (
              <span> This department has {employees.length} employees assigned to it. You must reassign them before deleting.</span>
            ) : (
              <span> This action cannot be undone.</span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={employees.length > 0}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentDetails;