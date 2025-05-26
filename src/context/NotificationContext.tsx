
import React, { createContext, useState, ReactNode } from 'react';

export interface NotificationContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, notification]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
