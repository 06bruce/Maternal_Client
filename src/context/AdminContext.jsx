import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { securityManager, sanitizeInput, isValidEmail } from '../utils/securityUtils';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Check if admin is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, [verifyToken]);

  const login = async (email, password) => {
    try {
      // Check if account is locked
      const lockStatus = securityManager.isLocked();
      if (lockStatus.locked) {
        securityManager.logSecurityEvent('login_attempt_while_locked', { email });
        return { 
          success: false, 
          message: lockStatus.message,
          locked: true
        };
      }

      // Validate input
      const sanitizedEmail = sanitizeInput(email);
      if (!isValidEmail(sanitizedEmail)) {
        return { success: false, message: 'Invalid email format' };
      }

      // Enforce delay between attempts (client-side rate limiting)
      await securityManager.enforceDelay();

      console.log('🔐 Admin login attempt to:', `${API_URL}/api/admin/login`);
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        email: sanitizedEmail,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        setAdmin(admin);
        setIsAuthenticated(true);
        
        // Reset failed attempts on successful login
        securityManager.resetAttempts();
        securityManager.logSecurityEvent('login_success', { email: sanitizedEmail });
        
        return { success: true };
      }
      
      // Record failed attempt
      const attemptResult = securityManager.recordFailedAttempt();
      securityManager.logSecurityEvent('login_failed', { 
        email: sanitizedEmail,
        attemptsRemaining: attemptResult.attemptsRemaining
      });
      
      return { 
        success: false, 
        message: response.data.message,
        attemptsRemaining: attemptResult.attemptsRemaining,
        warning: attemptResult.message
      };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('Error details:', error.response?.data);
      
      // Record failed attempt
      const attemptResult = securityManager.recordFailedAttempt();
      securityManager.logSecurityEvent('login_error', { 
        email,
        error: error.message,
        attemptsRemaining: attemptResult.attemptsRemaining
      });
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
        attemptsRemaining: attemptResult.attemptsRemaining,
        warning: attemptResult.message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    getAuthHeader,
    API_URL
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
