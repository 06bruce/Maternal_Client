import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../utils/api';
import toast from 'react-hot-toast';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [respondedHospital, setRespondedHospital] = useState(null);
  const [alertedHospitals, setAlertedHospitals] = useState([]);

  // Check for active emergency on mount
  useEffect(() => {
    const activeEmergency = localStorage.getItem('activeEmergency');
    if (activeEmergency) {
      try {
        const data = JSON.parse(activeEmergency);
        setEmergencyData(data);
        setEmergencyActive(true);
        setAlertedHospitals(data.hospitalIds || []);
        
        // Check if any hospital has responded
        if (data.respondedHospital) {
          setRespondedHospital(data.respondedHospital);
        }
      } catch (error) {
        console.error('Error loading active emergency:', error);
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
    if (!emergencyActive || !emergencyData?.id) return;

    const checkStatus = async () => {
      try {
        const response = await api.emergency.getStatus(emergencyData.id);
        const emergency = response.data.emergency;

        // Update if hospital responded
        if (emergency.status === 'responded' && emergency.respondedHospital) {
          if (!respondedHospital || respondedHospital.hospitalId !== emergency.respondedHospital.hospitalId) {
            hospitalResponded(emergency.respondedHospital);
          }
        }

        // Handle if emergency was cancelled from another device/session
        if (emergency.status === 'cancelled') {
          setEmergencyActive(false);
          setEmergencyData(null);
          setRespondedHospital(null);
          setAlertedHospitals([]);
          localStorage.removeItem('activeEmergency');
          toast.info('Emergency was cancelled');
        }
      } catch (error) {
        console.error('Error checking emergency status:', error);
        // Don't show error toast to avoid spamming user
      }
    };

    // Check immediately
    checkStatus();

    // Then poll every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [emergencyActive, emergencyData?.id, respondedHospital, hospitalResponded]);

  const sendEmergencyAlert = async (userData, userLocation) => {
    try {
      // Send emergency alert to backend
      const response = await api.emergency.sendAlert({
        userData: {
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
        },
        location: userLocation,
        timestamp: new Date().toISOString(),
      });

      const emergencyInfo = {
        id: response.data.emergencyId,
        userData,
        hospitals: response.data.hospitals || [],
        hospitalIds: response.data.alertedHospitals,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setEmergencyData(emergencyInfo);
      setEmergencyActive(true);
      setAlertedHospitals(response.data.hospitals || []);
      
      // Save to localStorage for persistence
      localStorage.setItem('activeEmergency', JSON.stringify(emergencyInfo));

      toast.success('Emergency alert sent to nearby hospitals!');
      return response.data;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast.error(handleApiError(error));
      throw error;
    }
  };

  

  const cancelEmergency = async () => {
    try {
      // Call backend to cancel emergency
      if (emergencyData?.id) {
        await api.emergency.cancel(emergencyData.id);
      }
      
      // Update frontend state
      setEmergencyActive(false);
      setEmergencyData(null);
      setRespondedHospital(null);
      setAlertedHospitals([]);
      localStorage.removeItem('activeEmergency');
      toast.success('Emergency alert cancelled');
    } catch (error) {
      console.error('Error cancelling emergency:', error);
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
