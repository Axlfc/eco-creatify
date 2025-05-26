
import React, { createContext, useState, ReactNode } from 'react';

export interface NotificationContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  notify: (notification: { type: string; message: string }) => void;
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

  const notify = (notification: { type: string; message: string }) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      read: false,
      createdAt: new Date().toISOString()
    };
    addNotification(newNotification);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead, 
        clearAll,
        notify
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
