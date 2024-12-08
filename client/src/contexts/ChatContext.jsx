import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Socket event handlers
      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        // Request chat history when connected
        newSocket.emit('fetchChatHistory');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Failed to connect to chat server');
      });

      newSocket.on('chatHistory', (history) => {
        setMessages(history);
        setLoading(false);
      });

      newSocket.on('newMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'Something went wrong');
      });

      setSocket(newSocket);

      return () => {
        newSocket.off('connect');
        newSocket.off('connect_error');
        newSocket.off('chatHistory');
        newSocket.off('newMessage');
        newSocket.off('error');
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = async (content) => {
    if (!socket || !content.trim()) {
      throw new Error('Unable to send message');
    }

    return new Promise((resolve, reject) => {
      socket.emit('chatMessage', { content: content.trim() });
      resolve(); // Resolve immediately as the message will be added via the newMessage event
    });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        socket,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const useSocket = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useSocket must be used within a ChatProvider');
  }
  return context.socket;
};