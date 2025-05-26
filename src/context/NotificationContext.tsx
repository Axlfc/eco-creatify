
import React, { createContext, useContext, ReactNode } from 'react';

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface NotificationContextType {
  notify: (notification: Notification) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notify = (notification: Notification) => {
    // Mock implementation - in real app this would show toast/notification
    console.log(`[${notification.type.toUpperCase()}] ${notification.message}`);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
