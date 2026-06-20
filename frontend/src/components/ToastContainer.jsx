import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastMessage = ({ id, message, type, onRemove }) => {
    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-[#DCFCE7] border-l-4 border-green-600',
                    text: 'text-green-800',
                    icon: <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-l-4 border-red-600',
                    text: 'text-red-800',
                    icon: <XCircle className="w-5 h-5 mr-3 text-red-600" />
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50 border-l-4 border-orange-500',
                    text: 'text-yellow-800',
                    icon: <AlertTriangle className="w-5 h-5 mr-3 text-orange-500" />
                };
            case 'info':
                return {
                    bg: 'bg-blue-50 border-l-4 border-blue-600',
                    text: 'text-blue-800',
                    icon: <Info className="w-5 h-5 mr-3 text-blue-600" />
                };
            default:
                return {
                    bg: 'bg-white border-l-4 border-gray-400',
                    text: 'text-gray-800',
                    icon: <Info className="w-5 h-5 mr-3 text-gray-400" />
                };
        }
    };

    const styles = getStyles();

    return (
        <div
            className={`flex items-center p-4 rounded shadow-lg transition-all duration-300 transform translate-x-0 ${styles.bg} ${styles.text}`}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
        >
            {styles.icon}
            <span className="font-medium mr-6 text-sm flex-1">{message}</span>
            <button
                onClick={() => onRemove(id)}
                className="ml-auto opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-5 z-50 flex flex-col gap-3 w-80 max-w-[calc(100vw-40px)] pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastMessage
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onRemove={removeToast}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
