import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { User, X, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BannerContainer = styled.div`
  position: sticky;
  top: 70px;
  z-index: 999;
  background: linear-gradient(135deg, #ec89b6 0%, #f8a5c2 100%);
  color: white;
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: var(--spacing-3) var(--spacing-4);
    flex-direction: column;
    gap: var(--spacing-3);
    text-align: center;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-2);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  p {
    font-size: var(--font-size-sm);
    margin: 0;
    opacity: 0.95;
  }
`;

const BannerActions = styled.div`
  display: flex;
  gap: var(--spacing-3);
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActionButton = styled(Link)`
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: all var(--transition-normal);
  white-space: nowrap;

  ${props => props.$primary ? `
    background: white;
    color: var(--primary);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  ` : `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `}
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background var(--transition-normal);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
  }
`;

const LoginBanner = ({ message, showSignup = true }) => {
  const { isAuthenticated } = useUser();
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if user is authenticated or if dismissed
  if (isAuthenticated || dismissed) {
    return null;
  }

  return (
    <BannerContainer>
      <BannerContent>
        <IconWrapper>
          <Sparkles size={24} />
        </IconWrapper>
        <TextContent>
          <h3>
            {message || 'Get the Full Experience!'}
          </h3>
          <p>
            Create a free account to save your progress, get personalized recommendations, and access all features.
          </p>
        </TextContent>
      </BannerContent>

      <BannerActions>
        <ActionButton to="/login" $primary>
          <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Sign In
        </ActionButton>
        {showSignup && (
          <ActionButton to="/login">
            Create Account
          </ActionButton>
        )}
      </BannerActions>

      <CloseButton onClick={() => setDismissed(true)} aria-label="Dismiss banner">
        <X size={20} />
      </CloseButton>
    </BannerContainer>
  );
};

export default LoginBanner;
