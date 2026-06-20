import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in
        setIsVisible(true);

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-600',
                    text: 'text-white',
                    icon: <CheckCircle className="w-5 h-5 mr-3" />
                };
            case 'error':
                return {
                    bg: 'bg-red-100 border border-red-200',
                    text: 'text-red-800',
                    icon: <XCircle className="w-5 h-5 mr-3 text-red-600" />
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50 border border-yellow-200',
                    text: 'text-yellow-800',
                    icon: <AlertCircle className="w-5 h-5 mr-3 text-yellow-600" />
                };
            default:
                return {
                    bg: 'bg-white border border-gray-200',
                    text: 'text-gray-800',
                    icon: null
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="fixed top-20 right-5 z-50 flex flex-col gap-2">
            <div
                className={`flex items-center p-4 rounded-xl shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                    } ${styles.bg} ${styles.text}`}
            >
                {styles.icon}
                <span className="font-medium mr-6">{message}</span>
                <button
                    onClick={handleClose}
                    className="ml-auto opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
