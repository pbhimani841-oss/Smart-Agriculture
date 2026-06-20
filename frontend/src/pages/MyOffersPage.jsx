import React, { useState, useEffect } from 'react';
import { Tag, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const MyOffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await api.get('/customer/my-offers');
            if (response.data.success) {
                setOffers(response.data.offers);
            }
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Offers (Negotiations)</h1>
                <p className="text-gray-500 mt-1">Track the status of price offers you've sent to farmers.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 uppercase tracking-wider text-[11px] font-bold text-gray-500">
                                <th className="px-6 py-4">Crop Name</th>
                                <th className="px-6 py-4">Farmer</th>
                                <th className="px-6 py-4 text-center">My Proposed Qty</th>
                                <th className="px-6 py-4 text-center">My Best Offer (₹/kg)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Date Sent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {offers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center">
                                            <Tag className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-600">You haven't sent any price offers yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{offer.crop?.crop_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium text-sm">
                                            {offer.farmer?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800">
                                            {parseFloat(offer.quantity)} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-blue-600">
                                            ₹{parseFloat(offer.requested_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${getStatusStyle(offer.status)}`}>
                                                    {offer.status === 'pending' && <Clock size={12} className="mr-1" />}
                                                    {offer.status === 'accepted' && <CheckCircle size={12} className="mr-1" />}
                                                    {offer.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                                                    {offer.status}
                                                </span>
                                                {offer.status === 'accepted' && (
                                                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 mt-1 rounded border border-green-200">
                                                        Order Created! Contact: {offer.farmer?.mobile_number}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            {new Date(offer.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyOffersPage;
