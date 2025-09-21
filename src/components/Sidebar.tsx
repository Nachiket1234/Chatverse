import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentRoom, setRooms } from '../store/chatSlice';
import { chatAPI } from '../utils/api';
import type { ChatRoom } from '../types';

const SidebarContainer = styled.aside`
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    width: 240px;
  }

  @media (max-width: 600px) {
    width: 200px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e1e5e9;
  background: white;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.125rem;
  font-weight: 600;
`;

const RoomsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const RoomItem = styled.div<{ $active: boolean }>`
  padding: 1rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#333'};

  &:hover {
    background: ${props => props.$active ? '#667eea' : '#e9ecef'};
  }
`;

const RoomName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const RoomDescription = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const RoomIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  margin-right: 0.75rem;
  float: left;
`;

const RoomContent = styled.div`
  overflow: hidden;
`;

const LoadingState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
`;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rooms, currentRoom, isLoading } = useAppSelector((state) => state.chat);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsData = await chatAPI.getRooms();
        dispatch(setRooms(roomsData));
        
        // Set first room as default if no room is selected
        if (roomsData.length > 0 && !currentRoom) {
          dispatch(setCurrentRoom(roomsData[0]));
        }
      } catch (error) {
        console.error('Failed to load rooms:', error);
      }
    };

    loadRooms();
  }, [dispatch, currentRoom]);

  const handleRoomSelect = (room: ChatRoom) => {
    dispatch(setCurrentRoom(room));
  };

  const getRoomIcon = (roomName: string) => {
    return roomName.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <SidebarContainer>
        <SidebarHeader>
          <SidebarTitle>Rooms</SidebarTitle>
        </SidebarHeader>
        <LoadingState>Loading rooms...</LoadingState>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Rooms</SidebarTitle>
      </SidebarHeader>
      
      <RoomsList>
        {rooms.map(room => (
          <RoomItem
            key={room.id}
            $active={currentRoom?.id === room.id}
            onClick={() => handleRoomSelect(room)}
          >
            <RoomIcon>
              {getRoomIcon(room.name)}
            </RoomIcon>
            <RoomContent>
              <RoomName>{room.name}</RoomName>
              {room.description && (
                <RoomDescription>{room.description}</RoomDescription>
              )}
            </RoomContent>
            <div style={{ clear: 'both' }}></div>
          </RoomItem>
        ))}
      </RoomsList>
    </SidebarContainer>
  );
};

export default Sidebar;