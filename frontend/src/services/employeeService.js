import api from './api';

const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  partialUpdateEmployee: async (id, updates) => {
    try {
      const response = await api.patch(`/employees/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getEmployeesByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/employees/department/${departmentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  searchEmployees: async (query) => {
    try {
      const response = await api.get(`/employees/search?query=${query}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getEmployeesBySalaryRange: async (min, max) => {
    try {
      const response = await api.get(`/employees/salary-range?min=${min}&max=${max}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default employeeService;