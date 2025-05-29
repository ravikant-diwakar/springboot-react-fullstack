import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: '',
      jobTitle: '',
      departmentId: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      profileImageUrl: '',
      isActive: true
    }
  });

  useEffect(() => {
    fetchDepartments();
    if (isEditMode) {
      fetchEmployee();
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      enqueueSnackbar('Failed to fetch departments', { variant: 'error' });
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      
      // Transform the data to match form fields
      const formData = {
        ...data,
        departmentId: data.department ? data.department.id : '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        hireDate: data.hireDate ? data.hireDate.split('T')[0] : ''
      };
      
      reset(formData);
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to fetch employee details');
      enqueueSnackbar('Failed to fetch employee details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Transform departmentId into a department object
      const department = departments.find(dept => dept.id === data.departmentId);
      const employeeData = {
        ...data,
        department
      };
      
      if (isEditMode) {
        await employeeService.updateEmployee(id, employeeData);
        enqueueSnackbar('Employee updated successfully', { variant: 'success' });
      } else {
        await employeeService.createEmployee(employeeData);
        enqueueSnackbar('Employee created successfully', { variant: 'success' });
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(error.message || 'An error occurred while saving the employee');
      enqueueSnackbar('Failed to save employee', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{ 
                  pattern: {
                    value: /^\+?[0-9]{10,15}$/,
                    message: 'Invalid phone number'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ 
                  validate: value => {
                    if (!value) return true;
                    const date = new Date(value);
                    const today = new Date();
                    return date < today || 'Date of birth must be in the past';
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="profileImageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Profile Image URL"
                    fullWidth
                    error={!!errors.profileImageUrl}
                    helperText={errors.profileImageUrl?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Employment Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Employment Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="jobTitle"
                control={control}
                rules={{ required: 'Job title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job Title"
                    fullWidth
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="departmentId"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.departmentId} required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      {...field}
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.departmentId && (
                      <FormHelperText>{errors.departmentId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="hireDate"
                control={control}
                rules={{ 
                  required: 'Hire date is required',
                  validate: value => {
                    const date = new Date(value);
                    const today = new Date();
                    return date <= today || 'Hire date cannot be in the future';
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hire Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.hireDate}
                    helperText={errors.hireDate?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary"
                control={control}
                rules={{ 
                  required: 'Salary is required',
                  min: {
                    value: 0.01,
                    message: 'Salary must be greater than 0'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Salary"
                    type="number"
                    fullWidth
                    error={!!errors.salary}
                    helperText={errors.salary?.message}
                    required
                    InputProps={{
                      startAdornment: '$'
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Active Employee"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Address Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State/Province"
                    fullWidth
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Postal Code"
                    fullWidth
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    fullWidth
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;