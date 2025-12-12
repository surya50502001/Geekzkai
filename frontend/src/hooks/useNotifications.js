import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { token } = useAuth();

    const fetchNotifications = async () => {
        if (!token) return;
        
        try {
            const response = await fetch('/api/notification', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        if (!token) return;
        
        try {
            const response = await fetch('/api/notification/unread-count', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (id) => {
        if (!token) return;
        
        try {
            const response = await fetch(`/api/notification/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => 
                    prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [token]);

    return {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead
    };
};