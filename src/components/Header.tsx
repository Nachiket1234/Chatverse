import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { togglePanel } from '../store/notificationSlice';
import { logoutUser } from '../store/authSlice';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e1e5e9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CreditsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-weight: 600;
`;

const CoinIcon = styled.span`
  font-size: 1.2rem;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const NotificationIcon = styled.span`
  font-size: 1.5rem;
  color: #667eea;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(25%, -25%);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #667eea;
`;

const Username = styled.span`
  font-weight: 600;
  color: #333;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #e1e5e9;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    border-color: #d6d8db;
  }
`;

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { credits } = useAppSelector((state) => state.chat);
  const { unreadCount } = useAppSelector((state) => state.notification);

  const handleNotificationClick = () => {
    dispatch(togglePanel());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <HeaderContainer>
      <Logo>Chatverse</Logo>
      
      <RightSection>
        <CreditsDisplay>
          <CoinIcon>🪙</CoinIcon>
          <span>{credits}</span>
        </CreditsDisplay>
        
        <NotificationButton onClick={handleNotificationClick}>
          <NotificationIcon>🔔</NotificationIcon>
          {unreadCount > 0 && (
            <NotificationBadge>
              {unreadCount > 99 ? '99+' : unreadCount}
            </NotificationBadge>
          )}
        </NotificationButton>
        
        <UserSection>
          {user?.avatar && (
            <Avatar src={user.avatar} alt={user.username} />
          )}
          <Username>{user?.username}</Username>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;