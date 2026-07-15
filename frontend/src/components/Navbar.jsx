import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileAvatar from './ProfileAvatar';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <nav className="bg-gradient-to-r from-[#166534] to-[#16a34a] text-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-extrabold flex items-center space-x-2 text-white tracking-tight hover:opacity-90 transition-opacity">
                    <span className="text-2xl drop-shadow-sm">🌱</span>
                    <span>Smart Agriculture</span>
                </Link>

                <div className="flex items-center space-x-2 md:space-x-6">
                    <Link to="/" className="font-medium text-green-50 hover:text-white transition-colors hidden sm:block">Home</Link>

                    {!user ? (
                        <>
                            <Link to="/login" className="font-medium text-green-50 hover:text-white transition-colors">Login</Link>
                            <div className="group relative">
                                <button className="font-medium px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition cursor-pointer shadow-sm">
                                    Get Started
                                </button>
                                <div className="absolute right-0 hidden group-hover:block bg-white text-gray-800 border rounded-xl shadow-lg w-48 mt-1 overflow-hidden transition-all z-50">
                                    <Link to="/signup/farmer" className="block px-4 py-3 hover:bg-green-50 border-b border-gray-100 font-medium">👨‍🌾 Farmer Signup</Link>
                                    <Link to="/signup/customer" className="block px-4 py-3 hover:bg-green-50 font-medium">🛒 Customer Signup</Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {user.role === 'farmer' && (
                                <div className="flex items-center space-x-1 md:space-x-4">
                                    <div className="group relative">
                                        <button className="font-medium text-green-50 hover:text-white transition-colors cursor-pointer flex items-center px-2 py-1 rounded-md hover:bg-green-700/50">
                                            Marketplace <span className="ml-1 text-[10px] opacity-70">▼</span>
                                        </button>
                                        <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-right z-50 pointer-events-none group-hover:pointer-events-auto">
                                            <Link to="/farmer/trade-crops" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">➕ List Crop</Link>
                                            <Link to="/farmer/selling-history" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">📦 Selling History</Link>
                                            <Link to="/farmer/offers" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">💬 Price Requests</Link>
                                        </div>
                                    </div>
                                    <div className="group relative hidden md:block">
                                        <button className="font-medium text-green-50 hover:text-white transition-colors cursor-pointer flex items-center px-2 py-1 rounded-md hover:bg-green-700/50">
                                            Tools <span className="ml-1 text-[10px] opacity-70">▼</span>
                                        </button>
                                        <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-right z-50 pointer-events-none group-hover:pointer-events-auto">
                                            <Link to="/chat" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">🤖 AI Assistant</Link>
                                            <Link to="/weather" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">☀️ Weather</Link>
                                            <Link to="/farmer/recommend/crop" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">🌱 Crop Suggestion</Link>
                                            <Link to="/farmer/recommend/fertilizer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">🧪 Fertilizer Info</Link>
                                            <Link to="/farmer/predict/yield" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50">📈 Yield Prediction</Link>
                                            <Link to="/farmer/predict/rainfall" className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">🌧️ Rainfall Forecast</Link>
                                        </div>
                                    </div>
                                    <Link to="/queries" className="font-medium text-green-50 hover:text-white transition-colors hidden sm:block">Queries</Link>
                                </div>
                            )}

                            {user.role === 'customer' && (
                                <div className="flex items-center space-x-2 md:space-x-4">
                                    <Link to="/customer/marketplace" className="font-medium text-green-50 hover:text-white transition-colors flex items-center">🛒 <span className="hidden sm:inline ml-1">Marketplace</span></Link>
                                    <Link to="/customer/my-offers" className="font-medium text-green-50 hover:text-white transition-colors hidden sm:block">My Offers</Link>
                                    <Link to="/customer/buying-history" className="font-medium text-green-50 hover:text-white transition-colors hidden md:block">📦 Buying History</Link>
                                    <Link to="/queries" className="font-medium text-green-50 hover:text-white transition-colors hidden sm:block">Queries</Link>
                                </div>
                            )}

                            {user.role === 'admin' && (
                                <>
                                    {/* Dashboard - Separate */}
                                    <Link
                                        to="/admin/dashboard"
                                        className="font-medium text-green-50 hover:text-white transition-colors cursor-pointer flex items-center px-2 py-1 rounded-md hover:bg-green-700/50"
                                    >
                                        Dashboard
                                    </Link>

                                    {/* Marketplace Dropdown */}
                                    <div className="group relative">
                                        <button className="font-medium text-green-50 hover:text-white transition-colors cursor-pointer flex items-center px-2 py-1 rounded-md hover:bg-green-700/50">
                                            Marketplace <span className="ml-1 text-[10px] opacity-70">▼</span>
                                        </button>

                                        <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-right z-50 pointer-events-none group-hover:pointer-events-auto">

                                            <Link
                                                to="/admin/crop-stocks"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50"
                                            >
                                                🌾 Crop Stocks
                                            </Link>

                                            <Link
                                                to="/admin/orders"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                🛍️ All Orders
                                            </Link>

                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center gap-3 md:gap-4 pl-2 md:pl-4 border-l border-green-500 ml-2">
                                <div className="text-white hover:text-green-200 transition drop-shadow-sm">
                                    <NotificationDropdown />
                                </div>
                                <ProfileAvatar />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
