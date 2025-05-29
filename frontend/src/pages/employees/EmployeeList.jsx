import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasRole } = useAuth();
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const canManageEmployees = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = employees.filter(employee => 
        employee.firstName.toLowerCase().includes(lowercasedQuery) || 
        employee.lastName.toLowerCase().includes(lowercasedQuery) ||
        employee.email.toLowerCase().includes(lowercasedQuery) ||
        (employee.jobTitle && employee.jobTitle.toLowerCase().includes(lowercasedQuery)) ||
        (employee.department && employee.department.departmentName.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      enqueueSnackbar('Failed to fetch employees', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleViewEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleEditEmployee = (id) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      enqueueSnackbar('Failed to delete employee', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Employees
        </Typography>
        
        {canManageEmployees && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/employees/new')}
          >
            Add Employee
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search employees by name, email, job title, or department..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>
                      {employee.department ? employee.department.departmentName : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.isActive ? "Active" : "Inactive"} 
                        color={employee.isActive ? "success" : "error"} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewEmployee(employee.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {canManageEmployees && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton 
                              color="secondary" 
                              size="small"
                              onClick={() => handleEditEmployee(employee.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {hasRole('ROLE_ADMIN') && (
                            <Tooltip title="Delete">
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleDeleteClick(employee)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchQuery ? 'No employees match your search criteria' : 'No employees found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}? 
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

export default EmployeeList;