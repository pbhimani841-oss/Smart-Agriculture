import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const fetchQueries = async () => {
        try {
            const response = await api.get('/admin/queries');
            setQueries(response.data);
        } catch (err) {
            setError('Failed to fetch queries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleResolve = async (id) => {
        try {
            await api.put(`/admin/queries/${id}/status`, { status: 'resolved' });
            // Update local state to reflect the resolved status
            setQueries(queries.map(q => q.id === id ? { ...q, status: 'resolved' } : q));
            showToast("Query resolved successfully!", "success");
        } catch (err) {
            showToast("Failed to update query status.", "error");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading queries...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-[20px] rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#16A34A] border-b pb-2">User Queries Management</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#DCFCE7] border-gray-100 text-[11px] uppercase tracking-wider font-bold text-green-900">
                        <th className="p-3">User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Message</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.map(query => (
                        <tr key={query.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium whitespace-nowrap">{query.user?.name || 'Unknown User'}</td>
                            <td className="p-3 whitespace-nowrap text-sm text-gray-600 capitalize">{query.user?.role || 'null'}</td>
                            <td className="p-3 font-semibold text-gray-800">{query.subject}</td>
                            <td className="p-3 text-gray-700 text-sm max-w-xs truncate" title={query.message}>{query.message}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${query.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {query.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                {query.status === 'pending' ? (
                                    <button
                                        onClick={() => handleResolve(query.id)}
                                        className="bg-[#16A34A] hover:bg-[#15803D] hover-lift text-white px-3 py-1 rounded-lg text-sm transition"
                                    >
                                        Mark Resolved
                                    </button>
                                ) : (
                                    <span className="text-gray-400 text-sm italic">Resolved</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {queries.length === 0 && (
                        <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500">No queries submitted yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminQueries;
