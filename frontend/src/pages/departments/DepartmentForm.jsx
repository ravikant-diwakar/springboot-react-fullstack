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
  CircularProgress,
  Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';
import departmentService from '../../services/departmentService';

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      departmentName: '',
      description: '',
      location: ''
    }
  });

  useEffect(() => {
    if (isEditMode) {
      fetchDepartment();
    }
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartmentById(id);
      reset(data);
    } catch (error) {
      console.error('Error fetching department:', error);
      setError('Failed to fetch department details');
      enqueueSnackbar('Failed to fetch department details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      if (isEditMode) {
        await departmentService.updateDepartment(id, data);
        enqueueSnackbar('Department updated successfully', { variant: 'success' });
      } else {
        await departmentService.createDepartment(data);
        enqueueSnackbar('Department created successfully', { variant: 'success' });
      }
      
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      setError(error.message || 'An error occurred while saving the department');
      enqueueSnackbar('Failed to save department', { variant: 'error' });
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
          {isEditMode ? 'Edit Department' : 'Add New Department'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="departmentName"
                control={control}
                rules={{ 
                  required: 'Department name is required',
                  minLength: {
                    value: 2,
                    message: 'Department name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Department name must be at most 100 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department Name"
                    fullWidth
                    error={!!errors.departmentName}
                    helperText={errors.departmentName?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/departments')}
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

export default DepartmentForm;