import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Inbox, Phone, User, Package } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const OfferRequestsPage = () => {
    const { showToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/farmer/price-requests');
            console.log(response.data.requests);
            if (response.data.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            const endpoint = `/farmer/price-requests/${id}/${action}`;
            const response = await api.post(endpoint);

            if (response.data.success) {
                // Remove the handled request from the list
                setRequests(requests.filter(req => req.id !== id));
                if (action === 'accept') {
                    showToast(`Offer accepted! Customer Order Created. Contact: ${response.data.customer.mobile_number}`, 'success');
                } else {
                    showToast('Offer rejected successfully.', 'info');
                }
            }
        } catch (error) {
            showToast(error.response?.data?.message || `Failed to ${action} offer.`, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Incoming Offers</h1>
                <p className="text-gray-500 mt-1">Review and manage price negotiation requests from customers.</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Pending Offers</h3>
                    <p className="text-gray-500">You currently have no pending price requests from customers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full relative overflow-hidden">
                            {/* Accent line top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                            <div className="flex justify-between items-start mb-5 pt-1">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{request.crop?.crop_name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-1">
                                        <Clock size={14} />
                                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wide">
                                    Pending
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{request.customer?.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                            <Phone size={12} className="mr-1" />
                                            {request.customer?.mobile_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Requested Qty</p>
                                        <p className="text-sm font-semibold text-gray-800 flex items-center">
                                            <Package size={14} className="mr-1.5 text-gray-400 shadow-sm" />
                                            {parseFloat(request.quantity)} kg
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Offered Price</p>
                                        <p className="text-sm font-bold text-green-600">
                                            ₹{parseFloat(request.requested_price).toFixed(2)}/kg
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleAction(request.id, 'reject')}
                                    disabled={actionLoading === request.id}
                                    className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === request.id ? 'Processing...' : (
                                        <>
                                            <XCircle size={16} />
                                            <span>Reject</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleAction(request.id, 'accept')}
                                    disabled={actionLoading === request.id}
                                    className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === request.id ? 'Processing...' : (
                                        <>
                                            <CheckCircle size={16} />
                                            <span>Accept</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfferRequestsPage;
