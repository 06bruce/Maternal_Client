import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://maternal-server.onrender.com',
  TIMEOUT: 180000, // 3 minutes to allow for Render cold starts
  ENDPOINTS: {
    CHAT: '/api/chat',
    HEALTH: '/health',
    HEALTH_CENTERS: '/api/health-centers',
    PREGNANCY_INFO: '/api/pregnancy-info',
    EMERGENCY_CONTACTS: '/api/emergency-contacts',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      ME: '/api/auth/me',
      LOGOUT: '/api/auth/logout',
    },
    APPOINTMENTS: '/api/appointments'
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Check if this is an admin request
    const isAdminRequest = config.url?.includes('/admin/');
    const token = isAdminRequest 
      ? localStorage.getItem('adminToken') 
      : localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isAdminLoginPage = window.location.pathname === '/admin/login';
      
      if (isAdminRoute && !isAdminLoginPage) {
        // Admin token expired - clear admin token and redirect to admin login
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else if (!isAdminRoute) {
        // User token expired - clear user token and redirect to user login
        localStorage.removeItem('authToken');
        localStorage.removeItem('maternalHealthUser');
        window.location.href = '/login';
      }
      // If on admin login page, don't redirect - just let the error be handled
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    googleAuth: (tokenData) => apiClient.post('/api/auth/google', tokenData),
    getProfile: () => apiClient.get('/api/auth/me'),
    updateProfile: (profileData) => apiClient.put('/api/auth/profile', profileData),
    logout: () => apiClient.post('/api/auth/logout'),
    forgotPassword: (data) => apiClient.post('/api/auth/forgot-password', data),
    resetPassword: (data) => apiClient.post('/api/auth/reset-password', data),
  },

  // Chat endpoints
  chat: {
    sendMessage: (messageData) => apiClient.post('/api/chat', messageData),
  },

  // Health endpoints
  health: {
    getCenters: () => apiClient.get('/api/health-centers'),
    getCentersBySector: (district, sector) => apiClient.get(`/api/health-centers/sector/${district}/${sector}`),
    getEmergencyContacts: () => apiClient.get('/api/emergency-contacts'),
  },

  // Admin endpoints (all verified with backend)
  admin: {
    // Analytics
    analytics: {
      get: () => apiClient.get('/api/admin/analytics')
    },
    
    // Users
    users: {
      getAll: (params) => apiClient.get('/api/admin/users', { params }),
      getById: (userId) => apiClient.get(`/api/admin/users/${userId}`),
      update: (userId, data) => apiClient.put(`/api/admin/users/${userId}`, data),
      delete: (userId) => apiClient.delete(`/api/admin/users/${userId}`)
    },
    
    // Pregnancy
    pregnancy: {
      getAll: () => apiClient.get('/api/admin/pregnant-users')
    },
    
    // Appointments
    appointments: {
      getAll: () => apiClient.get('/api/admin/appointments'),
      getById: (appointmentId) => apiClient.get(`/api/admin/appointments/${appointmentId}`),
      update: (appointmentId, data) => apiClient.put(`/api/admin/appointments/${appointmentId}`, data),
      delete: (appointmentId) => apiClient.delete(`/api/admin/appointments/${appointmentId}`)
    },
    
    // Emergencies
    emergencies: {
      getAll: (params) => apiClient.get('/api/admin/emergencies', { params }),
      getById: (emergencyId) => apiClient.get(`/api/admin/emergencies/${emergencyId}`),
      update: (emergencyId, data) => apiClient.put(`/api/admin/emergencies/${emergencyId}`, data),
      delete: (emergencyId) => apiClient.delete(`/api/admin/emergencies/${emergencyId}`)
    }
  },

  // Appointments endpoints
  appointments: {
    // Get available slots for a center on a specific date
    getSlots: (centerId, date, appointmentType) => {
      const params = appointmentType ? { appointmentType } : {};
      return apiClient.get(`/api/appointments/slots/${centerId}/${date}`, { params });
    },
    
    // Get all appointment types with their configurations
    getTypes: () => apiClient.get('/api/appointments/types'),
    
    // Book a new appointment
    book: (appointmentData) => apiClient.post('/api/appointments', appointmentData),
    
    // Get user's appointments
    getUserAppointments: () => apiClient.get('/api/appointments/user'),
    
    // Get single appointment details
    getById: (appointmentId) => apiClient.get(`/api/appointments/${appointmentId}`),
    
    // Update/reschedule appointment
    update: (appointmentId, data) => apiClient.put(`/api/appointments/${appointmentId}`, data),
    
    // Cancel appointment
    cancel: (appointmentId) => apiClient.delete(`/api/appointments/${appointmentId}`),
  },

  // Emergency endpoints
  emergency: {
    sendAlert: (emergencyData) => apiClient.post('/api/emergency/alert', emergencyData),
    getStatus: (emergencyId) => apiClient.get(`/api/emergency/${emergencyId}`),
    cancel: (emergencyId) => apiClient.delete(`/api/emergency/${emergencyId}`),
  },

  // Health check
  healthCheck: () => apiClient.get('/health'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  return 'An error occurred. Please try again.';
};

export const isNetworkError = (error) => {
  return !error.response && error.message === ' Network Error';
};

// Fetch-based API request function (for compatibility with existing code)
export const apiRequest = async (url, options = {}) => {
  const apiUrl = getApiUrl(url);
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };
  const response = await fetch(apiUrl, fetchOptions);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
};

export { API_CONFIG };
export default apiClient;
