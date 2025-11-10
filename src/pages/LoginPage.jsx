import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useChat } from '../context/ChatContext';
import { api, handleApiError } from '../utils/api';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import toast from 'react-hot-toast';

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--white) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
`;

const LoginCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 450px;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: var(--spacing-4);
  left: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-normal);
  
  &:hover {
    color: var(--primary);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-4);
    color: var(--primary);
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    font-size: var(--font-size-base);
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  padding: var(--spacing-1);
  margin-bottom: var(--spacing-6);
`;

const Tab = styled.button`
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-radius: var(--radius-md);
  background: ${props => props.active ? 'var(--white)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--gray-600)'};
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    color: var(--primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const InputGroup = styled.div`
  position: relative;
  
  .input-icon {
    position: absolute;
    left: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    z-index: 1;
  }
  
  .password-toggle {
    position: absolute;
    right: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    cursor: pointer;
    z-index: 1;
    
    &:hover {
      color: var(--gray-600);
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  padding-left: ${props => props.$hasIcon ? 'var(--spacing-12)' : 'var(--spacing-4)'};
  padding-right: ${props => props.$isPassword ? 'var(--spacing-12)' : 'var(--spacing-4)'};
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
  background: var(--white);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: var(--spacing-4);
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-top: var(--spacing-4);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-6) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-200);
  }
  
  span {
    padding: 0 var(--spacing-4);
    color: var(--gray-500);
    font-size: var(--font-size-sm);
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const ClearDataButton = styled.button`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--danger);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--danger);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  
  &:hover {
    background: var(--danger);
    color:  #820f0fff;
  }
`;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    age: '',
    gender: '',
    isPregnant: false,
    pregnancyStartDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const { language } = useChat();
  const navigate = useNavigate();

  const content = {
    rw: {
      login: 'Kwinjira',
      register: 'Kwiyandikisha',
      welcome: 'Murakaza neza kuri Maternal Hub',
      subtitle: 'Injira kugira ngo ubone serivisi zuzuye',
      email: 'Imeyili',
      password: 'Ijambo ry\'ibanga',
      name: 'Amazina',
      phone: 'Telefoni',
      age: 'Imyaka',
      isPregnant: 'Ndatwite',
      pregnancyStartDate: 'Itariki yo gutangira ubuzima',
      loginButton: 'Injira',
      registerButton: 'Iyandikishe',
      or: 'cyangwa',
      continueWithGoogle: 'Komeza na Google',
      noAccount: 'Niba utarafungura konti?',
      hasAccount: 'Niba ufite konti?',
      createAccount: 'Fungura konti',
      backToLogin: 'Subira kwinjira',
      loginSuccess: 'Winjiye neza!',
      registerSuccess: 'Konti yawe yashyizwemo neza!'
    },
    en: {
      login: 'Login',
      register: 'Register',
      welcome: 'Welcome to Maternal Hub',
      subtitle: 'Sign in to access full services',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone Number',
      age: 'Age',
      isPregnant: 'I am pregnant',
      pregnancyStartDate: 'Pregnancy Start Date',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      or: 'or',
      continueWithGoogle: 'Continue with Google',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create Account',
      backToLogin: 'Back to Login',
      loginSuccess: 'Successfully logged in!',
      registerSuccess: 'Account created successfully!'
    }
  };

  const currentContent = content[language] || content.en;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      // Send the Google token to your backend
      const response = await api.auth.googleAuth({
        credential: credentialResponse.credential
      });
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      login({ ...user, isAuthenticated: true });
      toast.success(currentContent.loginSuccess);
      navigate('/');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error(language === 'rw' ? 'Ikosa ryabaye' : 'Google authentication failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Real login
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password
        });
        const { token, user } = response.data;

        // Store token in localStorage
        localStorage.setItem('authToken', token);

        login({ ...user, isAuthenticated: true });
        toast.success(currentContent.loginSuccess);
        navigate('/');
      } else {
        // Real registration
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          gender: formData.gender || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          isPregnant: !!formData.isPregnant,
          pregnancyStartDate: formData.isPregnant && formData.pregnancyStartDate
            ? formData.pregnancyStartDate
            : undefined
        };

        const response = await api.auth.register(payload);
        const { token, user } = response.data;

        // Store token in localStorage
        localStorage.setItem('authToken', token);

        login({ ...user, isAuthenticated: true });
        toast.success(currentContent.registerSuccess);
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/">
          <ArrowLeft size={16} />
          {language === 'rw' ? 'Subira' : 'Back'}
        </BackButton>

        <Header>
          <div className="logo">
            <Heart />
            <span>Maternal Health</span>
          </div>
          <h1>{currentContent.welcome}</h1>
          <p>{currentContent.subtitle}</p>
        </Header>

        <TabContainer>
          <Tab
            active={isLogin}
            onClick={() => setIsLogin(true)}
          >
            {currentContent.login}
          </Tab>
          <Tab
            active={!isLogin}
            onClick={() => setIsLogin(false)}
          >
            {currentContent.register}
          </Tab>
        </TabContainer>

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <InputGroup>
              <User className="input-icon" size={20} />
              <Input
                type="text"
                name="name"
                placeholder={currentContent.name}
                value={formData.name}
                onChange={handleInputChange}
                $hasIcon
                required
              />
            </InputGroup>
          )}

          <InputGroup>
            <Mail className="input-icon" size={20} />
            <Input
              type="email"
              name="email"
              placeholder={currentContent.email}
              value={formData.email}
              onChange={handleInputChange}
              $hasIcon
              required
            />
          </InputGroup>

          <InputGroup>
            <Lock className="input-icon" size={20} />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={currentContent.password}
              value={formData.password}
              onChange={handleInputChange}
              $hasIcon
              $isPassword
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </InputGroup>

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link 
                to="/forgot-password" 
                style={{
                  color: 'var(--primary)',
                  fontSize: 'var(--font-size-sm)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                {language === 'rw' ? 'Wibagiwe ijambo ryibanga?' : 'Forgot your password?'}
              </Link>
            </div>
          )}

          {!isLogin && (
            <>
              <InputGroup>
                <Phone className="input-icon" size={20} />
                <Input
                  type="tel"
                  name="phone"
                  placeholder={currentContent.phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                  $hasIcon
                />
              </InputGroup>

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  inputProps={{ 'aria-label': 'Gender' }}
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>


              <InputGroup>
                <Calendar className="input-icon" size={20} />
                <Input
                  type="number"
                  name="age"
                  placeholder={currentContent.age}
                  value={formData.age}
                  onChange={handleInputChange}
                  $hasIcon
                  min="13"
                  max="100"
                />
              </InputGroup>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <input
                  type="checkbox"
                  name="isPregnant"
                  checked={formData.isPregnant}
                  onChange={handleInputChange}
                  style={{ width: 'auto' }}
                />
                <span>{currentContent.isPregnant}</span>
              </label>

              {formData.isPregnant && (
                <InputGroup>
                  <Calendar className="input-icon" size={20} />
                  <Input
                    type="date"
                    name="pregnancyStartDate"
                    value={formData.pregnancyStartDate}
                    onChange={handleInputChange}
                    $hasIcon
                  />
                </InputGroup>
              )}
            </>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '...' : (isLogin ? currentContent.loginButton : currentContent.registerButton)}
          </SubmitButton>
        </Form>

        <Divider>
          <span>{currentContent.or}</span>
        </Divider>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text={isLogin ? "signin_with" : "signup_with"}
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>

        <Divider>
          <span>or</span>
        </Divider>

        <ClearDataButton
          type="button"
          onClick={() => {
            localStorage.clear();
            toast.success('All stored data cleared!');
            window.location.reload();
          }}
        >
          🗑️ Clear All Stored Data
        </ClearDataButton>

      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
