import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, handleApiError } from '../utils/api';
import toast from 'react-hot-toast';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [respondedHospital, setRespondedHospital] = useState(null);
  const [alertedHospitals, setAlertedHospitals] = useState([]);
  const pollingIntervalRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Check for active emergency on mount
  useEffect(() => {
    const activeEmergency = localStorage.getItem('activeEmergency');
    if (activeEmergency) {
      try {
        const data = JSON.parse(activeEmergency);
        setEmergencyData(data);
        setEmergencyActive(true);
        setAlertedHospitals(data.hospitals || []);
        
        // Check if any hospital has responded
        if (data.respondedHospital) {
          setRespondedHospital(data.respondedHospital);
        }
      } catch (error) {
        console.error('[EMERGENCY] Error loading active emergency from localStorage:', error);
        localStorage.removeItem('activeEmergency');
      }
    }
  }, []);

  // Memoize handler used inside the polling effect
  const hospitalResponded = useCallback((hospital) => {
    setRespondedHospital(hospital);
    
    // Update emergency data
    const updatedEmergency = {
      ...emergencyData,
      respondedHospital: hospital,
      status: 'responded',
    };
    
    setEmergencyData(updatedEmergency);
    localStorage.setItem('activeEmergency', JSON.stringify(updatedEmergency));
    
    toast.success(`${hospital.name} has responded to your emergency!`);
  }, [emergencyData]);

  // Poll emergency status when active
  useEffect(() => {
    if (!emergencyActive || !emergencyData?.id) {
      // Clean up interval if emergency is no longer active
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const checkStatus = async () => {
      // Prevent concurrent requests
      if (isFetchingRef.current) {
        console.log('[EMERGENCY] Skipping status check - request already in progress');
        return;
      }

      isFetchingRef.current = true;

      try {
        // Verify token exists before making request
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('[EMERGENCY] ❌ No auth token found. User might not be logged in.');
          setEmergencyActive(false);
          setEmergencyData(null);
          toast.error('Session expired. Please log in again.');
          return;
        }

        console.log(`[EMERGENCY] Checking status for emergency: ${emergencyData.id}`);
        const response = await api.emergency.getStatus(emergencyData.id);
        const emergency = response.data.emergency;

        console.log(`[EMERGENCY] Status check successful:`, emergency.status);

        // Update if hospital responded
        if (emergency.status === 'responded' && emergency.respondedHospital) {
          if (!respondedHospital || respondedHospital.hospitalId !== emergency.respondedHospital.hospitalId) {
            hospitalResponded(emergency.respondedHospital);
          }
        }

        // Handle if emergency was cancelled from another device/session
        if (emergency.status === 'cancelled') {
          console.log('[EMERGENCY] Emergency was cancelled');
          setEmergencyActive(false);
          setEmergencyData(null);
          setRespondedHospital(null);
          setAlertedHospitals([]);
          localStorage.removeItem('activeEmergency');
          toast.info('Emergency was cancelled');
        }
      } catch (error) {
        console.error('[EMERGENCY] ❌ Error checking emergency status:', error);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          console.error('[EMERGENCY] 401 Unauthorized - token might be invalid or expired');
          // Don't cancel emergency, but inform user
          toast.error('Authentication expired. Please refresh the page.');
        } else if (error.response?.status === 404) {
          console.log('[EMERGENCY] Emergency not found - might have been deleted');
          setEmergencyActive(false);
          setEmergencyData(null);
          localStorage.removeItem('activeEmergency');
        } else if (error.response?.status === 429) {
          console.warn('[EMERGENCY] ⚠️  Rate limited. Slowing down polling...');
          // Will handle by extending interval
        } else {
          console.error('[EMERGENCY] Unexpected error:', error.message);
        }
      } finally {
        isFetchingRef.current = false;
      }
    };

    // Check immediately on first run
    checkStatus();

    // Then poll every 10 seconds (adjust if rate limited)
    pollingIntervalRef.current = setInterval(checkStatus, 10000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [emergencyActive, emergencyData?.id, respondedHospital, hospitalResponded]);

  const sendEmergencyAlert = async (userData, userLocation) => {
    try {
      // Verify token exists
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated. Please log in first.');
      }

      // Validate required fields
      const requiredFields = ['name', 'phone', 'email', 'age', 'gender'];
      const missingFields = requiredFields.filter(field => !userData?.[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare emergency data
      const emergencyRequest = {
        userData: {
          name: userData.name.trim(),
          phone: userData.phone.trim(),
          email: userData.email.trim(),
          age: Number(userData.age),
          gender: userData.gender.trim(),
        },
        location: userLocation || null,
        timestamp: new Date().toISOString(),
      };

      console.log('[EMERGENCY] Sending emergency alert...');

      // Send emergency alert to backend
      const response = await api.emergency.sendAlert(emergencyRequest);

      if (!response.data?.emergencyId) {
        throw new Error('Invalid response from server - no emergencyId received');
      }

      const emergencyInfo = {
        id: response.data.emergencyId,
        userData: emergencyRequest.userData,
        hospitals: response.data.hospitals || [],
        hospitalIds: response.data.alertedHospitals || [],
        timestamp: new Date().toISOString(),
        status: 'pending',
        location: userLocation,
      };

      console.log('[EMERGENCY] ✅ Emergency alert sent successfully:', emergencyInfo.id);

      // Update state
      setEmergencyData(emergencyInfo);
      setEmergencyActive(true);
      setAlertedHospitals(emergencyInfo.hospitals);
      
      // Save to localStorage for persistence
      localStorage.setItem('activeEmergency', JSON.stringify(emergencyInfo));

      toast.success('Emergency alert sent to nearby hospitals!');
      return response.data;
    } catch (error) {
      console.error('[EMERGENCY] ❌ Error sending emergency alert:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const cancelEmergency = async () => {
    try {
      // Call backend to cancel emergency
      if (emergencyData?.id) {
        console.log('[EMERGENCY] Cancelling emergency:', emergencyData.id);
        await api.emergency.cancel(emergencyData.id);
      }
      
      // Update frontend state
      setEmergencyActive(false);
      setEmergencyData(null);
      setRespondedHospital(null);
      setAlertedHospitals([]);
      localStorage.removeItem('activeEmergency');
      
      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      toast.success('Emergency alert cancelled');
    } catch (error) {
      console.error('[EMERGENCY] ❌ Error cancelling emergency:', error);
      toast.error('Failed to cancel emergency. Please try again.');
    }
  };

  const value = {
    emergencyActive,
    emergencyData,
    respondedHospital,
    alertedHospitals,
    sendEmergencyAlert,
    hospitalResponded,
    cancelEmergency,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
