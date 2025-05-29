import api from './api';

const departmentService = {
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateDepartment: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getEmployeesByDepartment: async (id) => {
    try {
      const response = await api.get(`/departments/${id}/employees`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getDepartmentByName: async (name) => {
    try {
      const response = await api.get(`/departments/name/${name}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default departmentService;