import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Shield, Mail, Lock, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-xl);
  max-width: 450px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-6);
  
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    margin-bottom: var(--spacing-4);
    color: var(--white);
  }
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    color: var(--gray-600);
    font-size: var(--font-size-sm);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
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

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) 40px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--radius-lg);
  color: #c33;
  font-size: var(--font-size-sm);
  
  svg {
    flex-shrink: 0;
  }
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: var(--radius-lg);
  color: #92400e;
  font-size: var(--font-size-sm);
  font-weight: 600;
  
  svg {
    flex-shrink: 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: var(--spacing-3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Footer = styled.div`
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
  text-align: center;
  
  p {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
        
        // Show warning about remaining attempts
        if (result.warning) {
          setWarning(result.warning);
        }
        
        // Show lockout status
        if (result.locked) {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Header>
          <div className="icon-wrapper">
            <Shield size={40} />
          </div>
          <h1>Admin Login</h1>
          <p>Access the Maternal Hub admin dashboard</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <AlertCircle size={18} />
              <span>{error}</span>
            </ErrorMessage>
          )}
          
          {warning && !error && (
            <WarningMessage>
              <ShieldAlert size={18} />
              <span>{warning}</span>
            </WarningMessage>
          )}

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <Mail size={18} />
              <Input
                id="email"
                type="email"
                placeholder="admin@maternalhub.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Lock size={18} />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : 'Sign In'}
          </Button>
        </Form>

        <Footer>
          <p>
            Not an admin? <a href="/login">Go to user login</a>
          </p>
        </Footer>
      </LoginCard>
    </Container>
  );
};

export default AdminLoginPage;
