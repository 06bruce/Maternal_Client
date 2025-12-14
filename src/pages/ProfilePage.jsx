import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Baby, 
  Edit3, 
  Save, 
  X,
  Bell,
  Globe,
  Shield,
  LogOut,
  Clock, 
  CalendarCheck, 
  MapPin, 
  XCircle,
  Loader
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppointmentCalendar from '../components/AppointmentCalendar';
import EmergencyButton from '../components/EmergencyButton';
import { api } from '../utils/api';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-6);
  padding-top: 100px;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  gap: var(--spacing-4);
  flex-wrap: wrap;
`;

const HeaderContent = styled.div`
  text-align: left;
`;

const ProfileTitle = styled.h1`
  font-size: var(--font-size-3xl);
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
`;

const ProfileSubtitle = styled.p`
  color: var(--gray-600);
  font-size: var(--font-size-lg);
`;

const ProfileCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--gray-900);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-lg);
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin-bottom: var(--spacing-1);
`;

const InfoValue = styled.div`
  font-size: var(--font-size-base);
  color: var(--gray-900);
  font-weight: 500;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  font-weight: 500;
`;

const Input = styled.input`
  padding: var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--success);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--success-dark);
    transform: translateY(-1px);
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--gray-200);
  color: var(--gray-700);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--gray-300);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--danger);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  color: var(--black);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--danger-dark);
    transform: translateY(-1px);
  }
`;

const PregnancyInfo = styled.div`
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  color: var(--white);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
`;

const PregnancyTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const PregnancyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-3);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-1);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.9;
`;

const AppointmentsSection = styled.div`
  margin-top: var(--spacing-6);
`;

const AppointmentCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-3);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary);
  
  &.upcoming {
    border-left-color: var(--success);
  }
  
  &.past {
    border-left-color: var(--gray-300);
    opacity: 0.8;
  }
  
  h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-2);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  
  .appointment-meta {
    display: flex;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-2);
    
    div {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }
  }
  
  .appointment-actions {
    display: flex;
    gap: var(--spacing-2);
    margin-top: var(--spacing-3);
    
    button {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
    }
    
    .cancel-btn {
      background: var(--red-100);
      color: var(--red-600);
      border: none;
    }
  }
`;

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    isPregnant: false,
    pregnancyStartDate: '',
    preferences: {
      language: 'rw',
      notifications: true
    }
  });
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        isPregnant: user.isPregnant || false,
        pregnancyStartDate: user.pregnancyStartDate ? new Date(user.pregnancyStartDate).toISOString().split('T')[0] : '',
        preferences: {
          language: user.preferences?.language || 'rw',
          notifications: user.preferences?.notifications !== false
        }
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout Sucessfully');
    }
  };

  const calculatePregnancyWeek = () => {
    if (!user?.pregnancyStartDate) return null;
    const start = new Date(user.pregnancyStartDate);
    const today = new Date();
    const weeksDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, Math.min(40, weeksDiff));
  };

  const getDaysUntilDue = () => {
    if (!user?.dueDate) return null;
    const today = new Date();
    const diffTime = new Date(user.dueDate) - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const currentWeek = calculatePregnancyWeek();
  const daysUntilDue = getDaysUntilDue();

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await api.appointments.getByUserId();
      setAppointments(response.data || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.appointments.cancel(appointmentId);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <HeaderContent>
          <ProfileTitle>My Profile</ProfileTitle>
          <ProfileSubtitle>Manage your account and pregnancy information</ProfileSubtitle>
        </HeaderContent>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <EmergencyButton />
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </LogoutButton>
        </div>
      </ProfileHeader>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
          <SectionTitle>
            <User size={24} />
            Personal Information
          </SectionTitle>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>
              <Edit3 size={16} />
              Edit Profile
            </EditButton>
          )}
        </div>

        {!isEditing ? (
          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <User size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Name</InfoLabel>
                <InfoValue>{user?.name ||' Not Set' }</InfoValue>
              </InfoContent>
            </InfoItem> 

            <InfoItem>
              <InfoIcon>
                <Mail size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user?.email || 'Not set'}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <Phone size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{user?.phone || 'Not set'}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <Calendar size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Age</InfoLabel>
                <InfoValue>{user?.age ? `${user.age} years` : 'Not set'}</InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        ) : (
          <Form onSubmit={handleSave}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="13"
                max="100"
              />
            </FormGroup>

            <FormGroup>
              <Label> Gender </Label>
              <Input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                placeholder="Enter your gender"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  name="isPregnant"
                  checked={formData.isPregnant}
                  onChange={handleInputChange}
                  style={{ marginRight: 'var(--spacing-2)' }}
                />
                I am pregnant
              </Label>
            </FormGroup>

            {formData.isPregnant && (
              <FormGroup>
                <Label>Pregnancy Start Date</Label>
                <Input
                  type="date"
                  name="pregnancyStartDate"
                  value={formData.pregnancyStartDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
            )}
          </Form>
        )}

        {isEditing && (
          <ButtonGroup>
            <CancelButton onClick={() => setIsEditing(false)}>
              <X size={16} />
              Cancel
            </CancelButton>
            <SaveButton type="submit" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </SaveButton>
          </ButtonGroup>
        )}
      </ProfileCard>

      {user?.isPregnant && currentWeek !== null && (
        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PregnancyInfo>
            <PregnancyTitle>
              <Baby size={24} />
              Pregnancy Progress
            </PregnancyTitle>
            <PregnancyStats>
              <StatItem>
                <StatValue>{currentWeek}</StatValue>
                <StatLabel>Current Week</StatLabel>
              </StatItem>
              {daysUntilDue !== null && (
                <StatItem>
                  <StatValue>{daysUntilDue}</StatValue>
                  <StatLabel>Days Until Due</StatLabel>
                </StatItem>
              )}
              <StatItem>
                <StatValue>{40 - currentWeek}</StatValue>
                <StatLabel>Weeks Remaining</StatLabel>
              </StatItem>
            </PregnancyStats>
          </PregnancyInfo>
        </ProfileCard>
      )}

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle>
          <Shield size={24} />
          Preferences
        </SectionTitle>
        
        <InfoGrid>
          <InfoItem>
            <InfoIcon>
              <Globe size={20} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Language</InfoLabel>
              <InfoValue>
                {user?.preferences?.language === 'rw' ? 'Kinyarwanda' : 
                 user?.preferences?.language === 'en' ? 'English' : 'Français'}
              </InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Bell size={20} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Notifications</InfoLabel>
              <InfoValue>
                {user?.preferences?.notifications ? 'Enabled' : 'Disabled'}
              </InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </ProfileCard>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionTitle>
          <CalendarCheck size={24} />
          My Appointments
        </SectionTitle>
        
        {loadingAppointments ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={32} className="animate-spin" />
          </div>
        ) : appointments.length > 0 ? (
          <AppointmentsSection>
            {appointments.map(appt => {
              const isPast = new Date(appt.date) < new Date();
              return (
                <AppointmentCard key={appt.id} className={isPast ? 'past' : 'upcoming'}>
                  <h3>
                    <MapPin size={18} />
                    {appt.centerName}
                  </h3>
                  <div className="appointment-meta">
                    <div>
                      <Calendar size={14} />
                      {new Date(appt.date).toLocaleDateString()}
                    </div>
                    <div>
                      <Clock size={14} />
                      {appt.time}
                    </div>
                  </div>
                  <div>Reason: {appt.reason.replace('_', ' ')}</div>
                  {!isPast && (
                    <div className="appointment-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelAppointment(appt.id)}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </AppointmentCard>
              );
            })}
          </AppointmentsSection>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--gray-500)' }}>
            No appointments scheduled
          </div>
        )}
      </ProfileCard>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionTitle>
          <Calendar size={24} />
          Appointment Calendar
        </SectionTitle>
        
        <AppointmentCalendar 
          appointments={appointments}
          onDateChange={(date) => {
            // Optional: Scroll to appointments for that date
            const dateStr = date.toISOString().split('T')[0];
            const element = document.getElementById(`appt-${dateStr}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;
