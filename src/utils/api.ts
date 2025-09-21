import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse, Message, ChatRoom } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Mock API for now

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API responses for development
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await mockDelay(1000);
    
    // Mock successful login
    if (credentials.username && credentials.password) {
      return {
        user: {
          id: '1',
          username: credentials.username,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.username,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await mockDelay(1000);
    
    // Mock successful registration
    if (credentials.username && credentials.password) {
      return {
        user: {
          id: Date.now().toString(),
          username: credentials.username,
          email: credentials.email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.username,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    
    throw new Error('Registration failed');
  },

  async logout(): Promise<void> {
    await mockDelay(500);
    // Mock logout
  },
};

export const chatAPI = {
  async getRooms(): Promise<ChatRoom[]> {
    await mockDelay(1000);
    
    return [
      {
        id: '1',
        name: 'General',
        description: 'General discussion',
        participants: [],
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Random',
        description: 'Random topics',
        participants: [],
        createdAt: new Date(),
      },
    ];
  },

  async getMessages(roomId: string): Promise<Message[]> {
    await mockDelay(800);
    
    return [
      {
        id: '1',
        text: 'Welcome to Chatverse!',
        userId: 'system',
        username: 'System',
        timestamp: new Date(Date.now() - 3600000),
        roomId,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
      },
      {
        id: '2',
        text: 'Hello everyone! 👋',
        userId: '2',
        username: 'Alice',
        timestamp: new Date(Date.now() - 1800000),
        roomId,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      },
    ];
  },

  async sendMessage(roomId: string, text: string): Promise<Message> {
    await mockDelay(500);
    
    return {
      id: Date.now().toString(),
      text,
      userId: '1',
      username: 'You',
      timestamp: new Date(),
      roomId,
    };
  },
};

export default api;