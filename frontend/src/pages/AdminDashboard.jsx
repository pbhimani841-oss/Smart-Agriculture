import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_farmers: 0, total_customers: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Admin Dashboard</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-[20px] rounded-xl shadow-sm border border-gray-100 hover-lift text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Total Farmers</h3>
                    <p className="text-5xl font-bold text-[#16A34A] mb-2">{stats.total_farmers}</p>
                    <Link to="/admin/farmers" className="block mt-4 text-[#16A34A] font-medium hover:underline">View Farmers →</Link>
                </div>

                <div className="bg-white p-[20px] rounded-xl shadow-sm border border-gray-100 hover-lift text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Total Customers</h3>
                    <p className="text-5xl font-bold text-blue-600 mb-2">{stats.total_customers}</p>
                    <Link to="/admin/customers" className="block mt-4 text-blue-600 font-medium hover:underline">View Customers →</Link>
                </div>

                <div className="md:col-span-2 bg-white p-[20px] rounded-xl shadow-sm border border-gray-100 hover-lift text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Queries Management</h3>
                    <p className="text-gray-500 mb-4">View and resolve user submitted queries.</p>
                    <Link to="/admin/queries" className="inline-block bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#15803D] hover-lift transition font-medium">Manage Queries</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
