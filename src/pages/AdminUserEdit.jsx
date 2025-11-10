import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import { getUserById, updateUser } from '../utils/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
  }
`;

const BackButton = styled.button`
  padding: var(--spacing-2);
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: var(--gray-700);
  display: flex;
  align-items: center;
  
  &:hover {
    background: var(--gray-50);
  }
`;

const Form = styled.form`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
`;

const FormGrid = styled.div`
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
  font-weight: 600;
  color: var(--gray-700);
`;

const Input = styled.input`
  padding: var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: var(--spacing-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
`;

const Button = styled.button`
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: var(--primary);
    color: var(--white);
    
    &:hover {
      background: var(--primary-dark);
    }
  ` : `
    background: var(--white);
    color: var(--gray-700);
    border: 2px solid var(--gray-200);
    
    &:hover {
      background: var(--gray-50);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  padding: var(--spacing-4);
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: var(--radius-lg);
  color: #0369a1;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-4);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    isPregnant: false,
    pregnancyStartDate: '',
    dueDate: '',
    currentWeek: '',
    preferences: {
      language: 'en',
      notifications: true
    }
  });

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserById(id);
      if (data.success) {
        const user = data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          age: user.age || '',
          gender: user.gender || '',
          isPregnant: user.isPregnant || false,
          pregnancyStartDate: user.pregnancyStartDate ? new Date(user.pregnancyStartDate).toISOString().split('T')[0] : '',
          dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
          currentWeek: user.currentWeek || '',
          preferences: {
            language: user.preferences?.language || 'en',
            notifications: user.preferences?.notifications !== false
          }
        });
      }
    } catch (err) {
      toast.error('Failed to load user');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateUser(id, formData);
      if (result.success) {
        toast.success('User updated successfully');
        navigate('/admin/users');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/users')}>
          <ArrowLeft size={20} />
        </BackButton>
        <h1>Edit User</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InfoBox>
          ℹ️ You can edit all user information except the password. The password can only be changed by the user themselves.
        </InfoBox>

        <FormGrid>
          <FormGroup>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              value={formData.age}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="language">Language</Label>
            <Select
              id="language"
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">French</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <FormGroup>
          <CheckboxGroup>
            <Checkbox
              id="isPregnant"
              name="isPregnant"
              type="checkbox"
              checked={formData.isPregnant}
              onChange={handleChange}
            />
            <Label htmlFor="isPregnant">Currently Pregnant</Label>
          </CheckboxGroup>
        </FormGroup>

        {formData.isPregnant && (
          <FormGrid>
            <FormGroup>
              <Label htmlFor="pregnancyStartDate">Pregnancy Start Date</Label>
              <Input
                id="pregnancyStartDate"
                name="pregnancyStartDate"
                type="date"
                value={formData.pregnancyStartDate}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="currentWeek">Current Week</Label>
              <Input
                id="currentWeek"
                name="currentWeek"
                type="number"
                min="0"
                max="42"
                value={formData.currentWeek}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>
        )}

        <FormGroup>
          <CheckboxGroup>
            <Checkbox
              id="notifications"
              name="preferences.notifications"
              type="checkbox"
              checked={formData.preferences.notifications}
              onChange={handleChange}
            />
            <Label htmlFor="notifications">Enable Notifications</Label>
          </CheckboxGroup>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate('/admin/users')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AdminUserEdit;
