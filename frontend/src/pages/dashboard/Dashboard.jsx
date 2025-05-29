import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    departmentCounts: []
  });
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [employees, departments] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments()
        ]);

        // Calculate department statistics
        const departmentCounts = departments.map(dept => {
          const count = employees.filter(emp => emp.department && emp.department.id === dept.id).length;
          return {
            name: dept.departmentName,
            count
          };
        });

        // Sort employees by hire date (newest first) and take top 5
        const sortedEmployees = [...employees].sort(
          (a, b) => new Date(b.hireDate) - new Date(a.hireDate)
        ).slice(0, 5);

        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          departmentCounts
        });
        
        setRecentEmployees(sortedEmployees);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                <PeopleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.totalEmployees}
                </Typography>
                <Typography color="text.secondary">
                  Total Employees
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button 
                size="small" 
                onClick={() => navigate('/employees')}
                endIcon={<TrendingUpIcon />}
              >
                View All Employees
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mr: 2 }}>
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.totalDepartments}
                </Typography>
                <Typography color="text.secondary">
                  Departments
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button 
                size="small" 
                onClick={() => navigate('/departments')}
                endIcon={<TrendingUpIcon />}
              >
                View All Departments
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mr: 2 }}>
                <PersonAddIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER') ? 'Actions' : 'Overview'}
                </Typography>
                <Typography color="text.secondary">
                  {hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER') ? 'Quick Access' : 'System Status'}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2 }}>
              {(hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER')) && (
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => navigate('/employees/new')}
                  startIcon={<PersonAddIcon />}
                >
                  Add New Employee
                </Button>
              )}
              {!hasRole('ROLE_ADMIN') && !hasRole('ROLE_MANAGER') && (
                <Typography variant="body2">
                  System is running normally
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Department Distribution Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Employee Distribution by Department
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.departmentCounts}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0466c8" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Employees */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recently Hired
            </Typography>
            <List>
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <Box key={employee.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/employees/${employee.id}`)}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${employee.firstName} ${employee.lastName}`} 
                        secondary={`${employee.jobTitle} | Hired: ${new Date(employee.hireDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                  No employees found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;