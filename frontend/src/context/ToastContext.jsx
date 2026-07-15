import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// Global event listener variable to allow non-React logic (like api.js) to trigger toasts safely
export const triggerGlobalToast = (message, type = 'error') => {
    const event = new CustomEvent('api-toast', { detail: { message, type } });
    window.dispatchEvent(event);
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        setToasts((prevToasts) => {
            // Keep maximum of 3 active toasts
            const activeToasts = prevToasts.length >= 3 ? prevToasts.slice(1) : [...prevToasts];
            return [...activeToasts, { id, message, type }];
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    // Effect to mount global event listener
    useEffect(() => {
        const handleGlobalToast = (e) => {
            if (e.detail && e.detail.message) {
                showToast(e.detail.message, e.detail.type || 'error');
            }
        };

        window.addEventListener('api-toast', handleGlobalToast);

        return () => {
            window.removeEventListener('api-toast', handleGlobalToast);
        };
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};
