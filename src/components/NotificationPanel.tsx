import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { markAsRead, markAllAsRead, setPanel } from '../store/notificationSlice';

const PanelOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const PanelContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
`;

const PanelTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const PanelActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #667eea;
    color: white;
  }
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const NotificationItem = styled.div<{ $read: boolean }>`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  background: ${props => props.$read ? 'white' : '#f0f7ff'};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
`;

const NotificationBadge = styled.span<{ type: 'info' | 'success' | 'warning' | 'error' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'error': return '#f8d7da';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'warning': return '#856404';
      case 'error': return '#721c24';
      default: return '#0c5460';
    }
  }};
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.5rem;
  display: block;
`;

const EmptyState = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const NotificationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isOpen } = useAppSelector((state) => state.notification);

  const handleClose = () => {
    dispatch(setPanel(false));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Close panel when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <PanelOverlay $isOpen={isOpen} onClick={handleOverlayClick} />
      <PanelContainer $isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>Notifications</PanelTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </PanelHeader>

        {notifications.length > 0 && (
          <PanelActions>
            {unreadCount > 0 && (
              <ActionButton onClick={handleMarkAllRead}>
                Mark all read
              </ActionButton>
            )}
          </PanelActions>
        )}

        <NotificationsList>
          {notifications.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔔</EmptyIcon>
              <div>No notifications yet</div>
            </EmptyState>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                $read={notification.read}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <NotificationHeader>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationBadge type={notification.type}>
                    {notification.type}
                  </NotificationBadge>
                </NotificationHeader>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>
                  {formatTime(notification.timestamp)}
                </NotificationTime>
              </NotificationItem>
            ))
          )}
        </NotificationsList>
      </PanelContainer>
    </>
  );
};

export default NotificationPanel;