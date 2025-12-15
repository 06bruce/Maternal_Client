import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, X, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { useEmergency } from '../context/EmergencyContext';
import { useChat } from '../context/ChatContext';

const EmergencyButtonWrapper = styled.div`
  position: relative;
`;

const EmergencyBtn = styled(motion.button)`
  background: ${props => props.$active ? 'var(--error)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'};
  color: var(--white);
  border: none;
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  ${props => props.$active && `
    animation: pulse 2s infinite;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
    }
    50% {
      box-shadow: 0 4px 25px rgba(231, 76, 60, 0.8);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--spacing-4);
`;

const ModalContent = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  max-width: 500px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  background: transparent;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  padding: var(--spacing-2);
  
  &:hover {
    color: var(--gray-900);
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-6);
  
  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto var(--spacing-4);
    background: var(--error-bg);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--error);
  }
  
  h2 {
    font-size: var(--font-size-2xl);
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    font-size: var(--font-size-base);
  }
`;

const UserInfo = styled.div`
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  
  h3 {
    font-size: var(--font-size-lg);
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-2) 0;
    border-bottom: 1px solid var(--gray-200);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: var(--gray-600);
      font-weight: 500;
    }
    
    .value {
      color: var(--gray-900);
      font-weight: 600;
    }
  }
`;

const HospitalStatus = styled.div`
  margin-bottom: var(--spacing-6);
  
  h3 {
    font-size: var(--font-size-lg);
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
`;

const HospitalCard = styled.div`
  background: ${props => props.$responded ? 'var(--success-bg)' : 'var(--white)'};
  border: 2px solid ${props => props.$responded ? 'var(--success)' : 'var(--gray-200)'};
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-3);
  
  .hospital-name {
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .hospital-phone {
    color: var(--primary);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-2);
    
    &.pending {
      color: var(--warning);
    }
    
    &.responded {
      color: var(--success);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
  
  button {
    flex: 1;
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: var(--radius-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &.confirm {
      background: var(--error);
      color: var(--white);
      border: none;
      
      &:hover {
        background: var(--error-dark);
      }
    }
    
    &.cancel {
      background: var(--white);
      color: var(--gray-700);
      border: 2px solid var(--gray-300);
      
      &:hover {
        border-color: var(--gray-400);
      }
    }
  }
`;

const EmergencyButton = ({ compact = false }) => {
  const { user, isAuthenticated } = useUser();
  const { language } = useChat();
  const {
    emergencyActive,
    emergencyData,
    respondedHospital,
    sendEmergencyAlert,
    cancelEmergency
  } = useEmergency();

  const [showModal, setShowModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const content = {
    rw: {
      emergency: "Hagurutse!",
      emergencyActive: "Hagurutse Yoherejwe",
      confirmTitle: "Ohereza Hagurutse?",
      confirmMessage: "Ubutumwa bw'ihutire buzoherekezwa kuri ibitaro 3+ biri hafi yawe.",
      yourInfo: "Amakuru yawe",
      name: "Amazina",
      phone: "Telefoni",
      email: "Imeyili",
      age: "Imyaka",
      gender: "Igitsina",
      alertedHospitals: "Ibitaro byakiriwe ubutumwa",
      pending: "Bitegereje...",
      responded: "Yasubije",
      confirm: "Ohereza Hagurutse",
      cancel: "Hagarika",
      cancelEmergency: "Hagarika Hagurutse",
      male: "Umugabo",
      female: "Umugore",
    },
    en: {
      emergency: "Emergency",
      emergencyActive: "Emergency Active",
      confirmTitle: "Send Emergency Alert?",
      confirmMessage: "Emergency alert will be sent to 3+ nearby hospitals with your information.",
      yourInfo: "Your Information",
      name: "Name",
      phone: "Phone",
      email: "Email",
      age: "Age",
      gender: "Gender",
      alertedHospitals: "Alerted Hospitals",
      pending: "Waiting...",
      responded: "Responded",
      confirm: "Send Emergency Alert",
      cancel: "Cancel",
      cancelEmergency: "Cancel Emergency",
      male: "Male",
      female: "Female",
    }
  };

  const currentContent = content[language] || content.en;

  const hasRequiredInfo = () => {
    const requiredFields = ['name', 'phone', 'email', 'age', 'gender'];
    return requiredFields.every(field => {
      const hasField = user?.[field] != null && user[field] !== '';
      if (!hasField) {
        console.log(`Missing required field: ${field}`, { value: user?.[field] });
      }
      return hasField;
    });
  };

  const handleEmergencyClick = () => {
    if (emergencyActive) {
      setShowModal(true);
      return;
    }

    // Check if user has all required information
    if (!hasRequiredInfo()) {
      toast.error('Please complete your profile information before sending an emergency alert');
      // Optionally redirect to profile page
      // navigate('/profile');
      return;
    }

    // If we have all required info, show confirmation
    setIsConfirming(true);
  };

  const handleConfirmEmergency = async () => {
    setLoading(true);
    let userLocation = null;

    // First, check if we have all required user data
    if (!hasRequiredInfo()) {
      toast.error('Please complete your profile information before sending an emergency alert');
      setLoading(false);
      return;
    }

    try {
      // Try to get user's location if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 300000 // Accept cached location up to 5 minutes old
              }
            );
          });
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.warn('Location access warning:', error);

          // User-friendly error messages
          const errorMessages = {
            1: 'Location permission denied. Emergency will be sent without precise location.',
            2: 'Location unavailable. Emergency will be sent without location.',
            3: 'Location request timed out. Emergency will be sent without location.'
          };

          const errorMessage = errorMessages[error.code] || 'Could not get your location. Emergency will be sent without it.';
          toast(errorMessage, {
            icon: '⚠️',
            duration: 5000
          });

          // Continue without location for any error except explicit permission denial
          if (error.code === 1) {
            // For permission denied, ask user if they want to continue without location
            const shouldContinue = window.confirm(
              'Without location, response times may be slower. Send emergency alert anyway?'
            );
            if (!shouldContinue) {
              setLoading(false);
              return;
            }
          }
        }
      } else {
        toast('Geolocation not supported. Emergency will be sent without location.', {
          icon: '⚠️',
          duration: 5000
        });
      }

      // Show loading state
      toast.loading('Sending emergency alert...');

      // Send the emergency alert
      await sendEmergencyAlert(user, userLocation);

      // Update UI state
      setIsConfirming(false);
      setShowModal(true);

      // Show success message
      toast.dismiss();
      toast.success('Emergency alert sent successfully!', { duration: 3000 });

    } catch (error) {
      console.error('Error sending emergency alert:', error);

      // More specific error messages based on error type
      let errorMessage = 'Failed to send emergency alert.';

      if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your information and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.message?.includes('Missing required fields')) {
        errorMessage = 'Your profile is missing required information. Please update your profile.';
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const handleCancelEmergency = () => {
    cancelEmergency();
    setShowModal(false);
    setIsConfirming(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <EmergencyButtonWrapper>
        <EmergencyBtn
          $active={emergencyActive}
          onClick={handleEmergencyClick}
          whileTap={{ scale: 0.95 }}
        >
          <AlertTriangle size={24} />
          {emergencyActive ? currentContent.emergencyActive : currentContent.emergency}
        </EmergencyBtn>
      </EmergencyButtonWrapper>

      <AnimatePresence>
        {(isConfirming || showModal) && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!emergencyActive) {
                setIsConfirming(false);
              }
            }}
          >
            <ModalContent
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!emergencyActive && (
                <CloseButton onClick={() => setIsConfirming(false)}>
                  <X size={24} />
                </CloseButton>
              )}

              <ModalHeader>
                <div className="icon">
                  <AlertTriangle size={32} />
                </div>
                <h2>{currentContent.confirmTitle}</h2>
                <p>{currentContent.confirmMessage}</p>
              </ModalHeader>

              <UserInfo>
                <h3>{currentContent.yourInfo}</h3>
                <div className="info-item">
                  <span className="label">{currentContent.name}:</span>
                  <span className="value">{user?.name || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">{currentContent.phone}:</span>
                  <span className="value">{user?.phone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">{currentContent.email}:</span>
                  <span className="value">{user?.email || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">{currentContent.age}:</span>
                  <span className="value">{user?.age || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">{currentContent.gender}:</span>
                  <span className="value">
                    {user?.gender === 'male' ? currentContent.male :
                      user?.gender === 'female' ? currentContent.female : 'N/A'}
                  </span>
                </div>
              </UserInfo>

              {emergencyActive && emergencyData && (
                <HospitalStatus>
                  <h3>
                    <MapPin size={20} />
                    {currentContent.alertedHospitals}
                  </h3>
                  {emergencyData.hospitals && emergencyData.hospitals.map((hospital) => (
                    <HospitalCard
                      key={hospital.id}
                      $responded={respondedHospital?.id === hospital.id}
                    >
                      <div className="hospital-name">
                        <span>{hospital.name}</span>
                        {respondedHospital?.id === hospital.id && (
                          <CheckCircle size={20} color="var(--success)" />
                        )}
                      </div>
                      <div className="hospital-phone">
                        <Phone size={16} />
                        {hospital.emergencyPhone}
                      </div>
                      <div className={`status ${respondedHospital?.id === hospital.id ? 'responded' : 'pending'}`}>
                        <Clock size={16} />
                        {respondedHospital?.id === hospital.id ?
                          currentContent.responded :
                          currentContent.pending}
                      </div>
                    </HospitalCard>
                  ))}
                </HospitalStatus>
              )}

              <ButtonGroup>
                {!emergencyActive ? (
                  <>
                    <button className="cancel" onClick={() => setIsConfirming(false)}>
                      {currentContent.cancel}
                    </button>
                    <button
                      className="confirm"
                      onClick={handleConfirmEmergency}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : currentContent.confirm}
                    </button>
                  </>
                ) : (
                  <button className="cancel" onClick={handleCancelEmergency}>
                    {currentContent.cancelEmergency}
                  </button>
                )}
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;
