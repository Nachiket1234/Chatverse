import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../hooks/redux';
import { addNotification } from '../store/notificationSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import NotificationPanel from '../components/NotificationPanel';

const ChatLayout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Add welcome notification
    dispatch(addNotification({
      id: 'welcome',
      title: 'Welcome to Chatverse! 🎉',
      message: 'You have 100 credits to start chatting. Each message costs 1 credit.',
      type: 'success',
      timestamp: new Date(),
      read: false,
    }));

    // Simulate periodic notifications
    const notificationInterval = setInterval(() => {
      const notifications = [
        {
          title: 'New Feature!',
          message: 'Check out our new emoji reactions feature.',
          type: 'info' as const,
        },
        {
          title: 'Credit Bonus',
          message: 'You received 10 bonus credits for being active!',
          type: 'success' as const,
        },
        {
          title: 'Server Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2 AM.',
          type: 'warning' as const,
        },
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      dispatch(addNotification({
        id: Date.now().toString(),
        ...randomNotification,
        timestamp: new Date(),
        read: false,
      }));
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(notificationInterval);
    };
  }, [dispatch]);

  return (
    <ChatLayout>
      <Header />
      <MainContent>
        <Sidebar />
        <ChatWindow />
      </MainContent>
      <NotificationPanel />
    </ChatLayout>
  );
};

export default Chat;