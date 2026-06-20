import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Trash2 } from 'lucide-react';

const BaseUserList = ({ endpoint, title, colorClass }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get(endpoint);
                setUsers(response.data);
            } catch (err) {
                setError(`Failed to fetch ${title.toLowerCase()}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [endpoint, title]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

        try {
            const response = await api.delete(`/admin/users/${id}`);
            if (response.data.success) {
                setUsers(prev => prev.filter(user => user.id !== id));
                showToast(response.data.message, 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete user.', 'error');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-[20px] rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <h2 className={`text-2xl font-bold mb-6 ${colorClass}`}>{title}</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#DCFCE7] border-gray-100 text-[11px] uppercase tracking-wider font-bold text-green-900">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Mobile</th>
                        <th className="p-3">State</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Taluka</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{user.name}</td>
                            <td className="p-3 text-sm">{user.email}</td>
                            <td className="p-3 text-sm">{user.mobile_number}</td>
                            <td className="p-3 text-sm">{user.state}</td>
                            <td className="p-3 text-sm">{user.district}</td>
                            <td className="p-3 text-sm">{user.taluka}</td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => handleDelete(user.id, user.name)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="7" className="p-4 text-center text-gray-500">No {title.toLowerCase()} found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export const FarmersList = () => <BaseUserList endpoint="/admin/farmers" title="Farmers Directory" colorClass="text-[#16A34A]" />;
export const CustomersList = () => <BaseUserList endpoint="/admin/customers" title="Customers Directory" colorClass="text-blue-600" />;
