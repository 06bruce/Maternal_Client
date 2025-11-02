import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Heart, 
  Globe, 
  User, 
  Wifi,
  WifiOff
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(219, 121, 165, 0.49);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 var(--spacing-4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;`;
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  text-decoration: none;
  color: #ffff;
  font-weight: 700;
  font-size: var(--font-size-x4);

  svg {
    width: 30px;
    height: 20px;
  }

  span {
    font-size: 20px; // adjust this value as needed
  }
`;


const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  background: rgba(254, 253, 254, 0.19);
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-lg);
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    color: var(--primary);
  }
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  // border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--gray-700);
  font-weight: 500;
  height: 36px;
  text-decoration: none;
  cursor: pointer;
  background: rgba(254, 253, 254, 0.19);
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
`;


const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 500;
  
  ${props => props.$isOffline ? `
    background: var(--error);
    color: var(--white);
  ` : `
    background: var(--success);
    color: var(--white);
  `}
`;

const Header = () => {
  const { language, setLanguage, isOffline } = useChat();
  const { user } = useUser();

  const languages = [
    { code: 'rw', name: 'Kiny' },
    { code: 'en', name: 'Eng' },
    { code: 'fr', name: 'Fran' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <Heart />
          <span className='maternal'>Maternal Hub</span>
        </Logo>

        <HeaderActions>
          {/* Online/Offline Status */}
          <StatusIndicator $isOffline={isOffline}>
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            {isOffline ? 'Offline' : '' }
          </StatusIndicator>

          {/* Language Switcher */}
          <LanguageButton onClick={() => handleLanguageChange(language === 'rw' ? 'en' : language === 'en' ? 'fr' : 'rw')}>
            <Globe size={16} />
            {currentLanguage?.name}
          </LanguageButton>

          {/* User Menu */}
          {user ? (
            <UserMenuButton as={Link} to="/profile">
              <User size={16} />
              {user.name || 'User'}
            </UserMenuButton>
          ) : (
            <UserMenuButton as={Link} to="/login">
              <User size={16} />
              Login
            </UserMenuButton>
          )}

        </HeaderActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
