import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Removed variable colors to enforce strict white/green request

const ProfileAvatar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Get first letter of name, fallback to 'U'
    const initial = (user.name ? user.name.charAt(0) : 'U').toUpperCase();

    // White background, Green text exactly as requested

    const profileLink = user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'farmer' ? '/farmer/profile' : '/customer/profile';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none group rounded-full p-1 hover:bg-white/10 transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-white text-[#16A34A] shadow-sm border border-transparent group-hover:ring-2 group-hover:ring-white/50 transition-all`}>
                    {initial}
                </div>
                <div className="text-left hidden md:block max-w-[120px]">
                    <p className="text-sm font-medium text-white truncate leading-tight">{user.name}</p>
                    <p className="text-[10px] text-green-100 uppercase tracking-wider font-semibold opacity-90">{user.role}</p>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50 md:hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                        <Link
                            to={profileLink}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                            <User size={16} className="mr-3 text-gray-400 group-hover:text-green-500" />
                            My Profile
                        </Link>

                        <div className="h-px bg-gray-100 my-1"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} className="mr-3 text-red-400" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar;
