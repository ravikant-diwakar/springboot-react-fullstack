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
  Clear as ClearIcon,
  PeopleAlt as PeopleIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import departmentService from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';

const DepartmentList = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasRole } = useAuth();
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [employeeCount, setEmployeeCount] = useState({});

  const isAdmin = hasRole('ROLE_ADMIN');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = departments.filter(department => 
        department.departmentName.toLowerCase().includes(lowercasedQuery) || 
        (department.description && department.description.toLowerCase().includes(lowercasedQuery)) ||
        (department.location && department.location.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredDepartments(filtered);
    }
  }, [searchQuery, departments]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
      setFilteredDepartments(data);
      
      // Fetch employee counts for each department
      const countPromises = data.map(async (dept) => {
        try {
          const employees = await departmentService.getEmployeesByDepartment(dept.id);
          return { id: dept.id, count: employees.length };
        } catch (error) {
          console.error(`Error fetching employees for department ${dept.id}:`, error);
          return { id: dept.id, count: 0 };
        }
      });
      
      const counts = await Promise.all(countPromises);
      const countMap = counts.reduce((acc, curr) => {
        acc[curr.id] = curr.count;
        return acc;
      }, {});
      
      setEmployeeCount(countMap);
    } catch (error) {
      console.error('Error fetching departments:', error);
      enqueueSnackbar('Failed to fetch departments', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleViewDepartment = (id) => {
    navigate(`/departments/${id}`);
  };

  const handleEditDepartment = (id) => {
    navigate(`/departments/${id}/edit`);
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    
    try {
      await departmentService.deleteDepartment(departmentToDelete.id);
      setDepartments(departments.filter(dept => dept.id !== departmentToDelete.id));
      enqueueSnackbar('Department deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting department:', error);
      enqueueSnackbar('Failed to delete department. Make sure it has no employees assigned.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDepartmentToDelete(null);
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
          Departments
        </Typography>
        
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/departments/new')}
          >
            Add Department
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search departments by name, description, or location..."
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
              <TableCell>Department Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Employees</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <TableRow key={department.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {department.departmentName}
                    </Typography>
                  </TableCell>
                  <TableCell>{department.description || 'N/A'}</TableCell>
                  <TableCell>{department.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={<PeopleIcon />}
                      label={employeeCount[department.id] || 0} 
                      color="primary" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleViewDepartment(department.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {isAdmin && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton 
                            color="secondary" 
                            size="small"
                            onClick={() => handleEditDepartment(department.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteClick(department)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchQuery ? 'No departments match your search criteria' : 'No departments found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the "{departmentToDelete?.departmentName}" department? 
            This action cannot be undone and may affect employees assigned to this department.
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

export default DepartmentList;