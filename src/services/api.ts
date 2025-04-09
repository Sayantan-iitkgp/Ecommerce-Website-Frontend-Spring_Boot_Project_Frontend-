import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable credentials for CORS
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      
      // Backend returns just the token string
      const token = response.data;
      
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format');
      }

      try {
        const decoded = jwtDecode(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }
        
        // Return just the token string
        return token;
      } catch (error) {
        console.error('Token decode error:', error);
        throw new Error('Invalid token format');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signUp: async (data: { username: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/sign_up`, data);
      if (response.data === "User saved") {
        return response.data;
      } else if (response.data === "There is already one user this same username or password. So change this!") {
        throw new Error("Username or password already exists. Please choose different credentials.");
      } else {
        throw new Error(response.data || "Failed to sign up");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token'); // Still remove token even if logout fails
      throw error;
    }
  },

  updateProfile: async (data: { username: string; password: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.put(
        `${API_URL}/update`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Failed to update profile');
    } catch (error: any) {
      console.error('Update profile error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  },

  deleteProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.delete(`${API_URL}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Delete profile error:', error);
      throw error;
    }
  },
};

export const productAPI = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error: any) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  createProduct: async (formData: FormData) => {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error: any) {
      console.error('Delete product error:', error);
      throw error;
    }
  },
};

// User Profile APIs
export const userAPI = {
  updateProfile: (userData: any) => api.put('/api/update', userData),
  deleteProfile: () => api.delete('/api/delete'),
};

export default api; 