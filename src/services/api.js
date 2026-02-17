import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginAdmin = (credentials) => api.post('/auth/admin/login', credentials);
export const loginDriver = (phone) => api.post('/auth/driver/login', { phone });

// Drivers
export const getDrivers = () => api.get('/drivers');
export const getAvailableDrivers = () => api.get('/drivers/available');
export const updateDriverStatus = (id, status) => api.put(`/drivers/${id}/status`, { status });
export const createDriver = (data) => api.post('/drivers', data);

// Requests
export const createRequest = (data) => api.post('/requests', data);
export const getRequests = () => api.get('/requests');
export const assignDriver = (requestId, driverId) => 
  api.put(`/requests/${requestId}/assign`, { driverId });
export const updateRequestStatus = (requestId, status) => 
  api.put(`/requests/${requestId}/status`, { status });
