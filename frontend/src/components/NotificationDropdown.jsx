import React, { useState, useEffect, useContext, useRef } from 'react';
import { Bell, Check, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const NotificationDropdown = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await api.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unread_count);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const intervalId = setInterval(fetchNotifications, 30000);
            return () => clearInterval(intervalId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(notif => notif.id === id ? { ...notif, is_read: 1 } : notif)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('/notifications/mark-all-read');
            setNotifications(prev => prev.map(notif => ({ ...notif, is_read: 1 })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white hover:text-green-200 transition-colors rounded-full hover:bg-green-700/50 focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4 ring-2 ring-green-600">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-green-600 hover:text-green-800 transition flex items-center"
                            >
                                <CheckCircle2 size={14} className="mr-1" /> Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {notifications.map(notif => (
                                    <li
                                        key={notif.id}
                                        className={`p-4 transition-colors hover:bg-gray-50 ${!notif.is_read ? 'bg-green-50/30' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <h4 className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                <span className="text-[10px] text-gray-400 mt-2 block">
                                                    {formatDate(notif.created_at)}
                                                </span>
                                            </div>
                                            {!notif.is_read && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                                                    className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-md hover:bg-green-100"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
