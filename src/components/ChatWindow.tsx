import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addMessage, setMessages, decrementCredits } from '../store/chatSlice';
import { addNotification } from '../store/notificationSlice';
import { chatAPI } from '../utils/api';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const RoomTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.125rem;
  font-weight: 600;
`;

const RoomInfo = styled.p`
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.875rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageGroup = styled.div<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  align-self: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e1e5e9;
`;

const Username = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #999;
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  background: ${props => props.$isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#f1f3f4'};
  color: ${props => props.$isOwn ? 'white' : '#333'};
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border-top-left-radius: ${props => props.$isOwn ? '18px' : '4px'};
  border-top-right-radius: ${props => props.$isOwn ? '4px' : '18px'};
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  transition: transform 0.2s ease;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const ChatWindow: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const { currentRoom, messages, credits } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  // Load messages when room changes
  useEffect(() => {
    if (currentRoom) {
      loadMessages();
    }
  }, [currentRoom?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!currentRoom) return;
    
    setIsLoading(true);
    try {
      const roomMessages = await chatAPI.getMessages(currentRoom.id);
      dispatch(setMessages(roomMessages));
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentRoom || !user || credits <= 0) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      const newMessage = await chatAPI.sendMessage(currentRoom.id, text);
      dispatch(addMessage({
        ...newMessage,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
      }));

      // Deduct credits
      dispatch(decrementCredits(1));

      // Add notification about credit usage
      dispatch(addNotification({
        id: Date.now().toString(),
        title: 'Message Sent',
        message: `1 credit used. ${credits - 1} credits remaining.`,
        type: 'info',
        timestamp: new Date(),
        read: false,
      }));

    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch(addNotification({
        id: Date.now().toString(),
        title: 'Error',
        message: 'Failed to send message. Please try again.',
        type: 'error',
        timestamp: new Date(),
        read: false,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDefaultAvatar = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  };

  if (!currentRoom) {
    return (
      <ChatContainer>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <div>Select a room to start chatting</div>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <RoomTitle>{currentRoom.name}</RoomTitle>
        {currentRoom.description && (
          <RoomInfo>{currentRoom.description}</RoomInfo>
        )}
      </ChatHeader>

      <MessagesContainer>
        {isLoading ? (
          <EmptyState>
            <div>Loading messages...</div>
          </EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💭</EmptyIcon>
            <div>No messages yet. Start the conversation!</div>
          </EmptyState>
        ) : (
          messages.map(message => {
            const isOwn = message.userId === user?.id;
            return (
              <MessageGroup key={message.id} $isOwn={isOwn}>
                {!isOwn && (
                  <MessageHeader>
                    <Avatar 
                      src={message.avatar || getDefaultAvatar(message.username)} 
                      alt={message.username}
                    />
                    <Username>{message.username}</Username>
                    <Timestamp>{formatTime(message.timestamp)}</Timestamp>
                  </MessageHeader>
                )}
                <MessageBubble $isOwn={isOwn}>
                  {message.text}
                </MessageBubble>
                {isOwn && (
                  <Timestamp style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#999' }}>
                    {formatTime(message.timestamp)}
                  </Timestamp>
                )}
              </MessageGroup>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={credits > 0 ? "Type a message..." : "No credits remaining"}
            disabled={credits <= 0}
            rows={1}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!messageText.trim() || credits <= 0}
          >
            ➤
          </SendButton>
        </InputWrapper>
        {credits <= 0 && (
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.875rem', 
            color: '#e74c3c',
            textAlign: 'center'
          }}>
            You need credits to send messages
          </div>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;