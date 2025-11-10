import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Heart, Eye, EyeOff } from 'lucide-react';
import { api, handleApiError } from '../utils/api';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--white) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
`;

const Card = styled(motion.div)`
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
    line-height: 1.6;
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
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    
    &:hover {
      color: var(--gray-600);
    }
  }
`;

const Label = styled.label`
  display: block;
  color: var(--gray-700);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-2);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  padding-left: var(--spacing-12);
  padding-right: var(--spacing-12);
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

const PasswordRequirements = styled.div`
  margin-top: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  
  ul {
    margin: 0;
    padding-left: var(--spacing-5);
  }
  
  li {
    margin-bottom: var(--spacing-1);
    
    &.valid {
      color: var(--success);
    }
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

const ErrorMessage = styled.div`
  background: var(--danger-light);
  border: 2px solid var(--danger);
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  color: var(--danger-dark);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-2);
`;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUser();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [searchParams]);

  const validatePassword = (pass) => {
    const errors = [];
    if (pass.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError(errors.join('. '));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.resetPassword({ token, password });
      
      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('authToken', response.data.token);
        
        // Update user context
        login({ ...response.data.user, isAuthenticated: true });
        
        // Show success message
        toast.success('Password reset successful! Redirecting to home...');
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/login">
          <ArrowLeft size={16} />
          Back to Login
        </BackButton>

        <Header>
          <div className="logo">
            <Heart />
            <span>Maternal Health</span>
          </div>
          <h1>Create New Password</h1>
          <p>
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </Header>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password">New Password</Label>
            <InputGroup>
              <Lock className="input-icon" size={20} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading || !token}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || !token}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputGroup>
            <PasswordRequirements>
              <ul>
                <li className={password.length >= 6 ? 'valid' : ''}>
                  {password.length >= 6 ? '✓' : '○'} At least 6 characters
                </li>
              </ul>
            </PasswordRequirements>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <InputGroup>
              <Lock className="input-icon" size={20} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading || !token}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading || !token}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputGroup>
            {confirmPassword && password !== confirmPassword && (
              <ErrorMessage style={{ marginTop: 'var(--spacing-2)' }}>
                Passwords do not match
              </ErrorMessage>
            )}
          </div>

          <SubmitButton type="submit" disabled={isLoading || !token}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
